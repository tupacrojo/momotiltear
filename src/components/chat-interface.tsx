"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/chat-message";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setIsLoading(true);
      setError(null);
      const newMessage = { role: "user", content: message };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        const aiResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: [
                {
                  type: "text",
                  text: 'Vas a recibir la respuesta a la pregunta ¿Que esta haciendo momo?\nCrea una pregunta que enfade a "Momo" al contradecir sus acciones o dudar de sus decisiones, usando un tono ligeramente sarcástico y argentino, no insultes pero tampoco es necesario una conducta formal, las respustas que tenes que dar son cortas y me gustaria que utilices bocavulario de la Coscu Army(Nashe, Ido, De Ruta, Buenardo).\n\n"Momo" es un streamer argentino con raíces italianas de las que está muy orgulloso, a menudo exagera sus anécdotas y habilidades, y tiene ciertos puntos débiles (como haber perdido una pelea de boxeo contra Viruzz o que pongan en duda su lealtad). \n\n# Información a tener en cuenta\n\n- A "Momo" le gusta presumir de ser italiano y de sus raíces italianas.\n- Momo es técnico electrónico pero nunca ejerció la profesión y ha tenido varios trabajos que no parecen estar del todo comprobados.\n- Exagera sobre su habilidad para pelear,\n- Exagera sobre su lealtad\n- Exagera sobre sus habilidades técnicas,\n- Exagera sobre sus supuestas habilidades en el fútbol, donde llegó cerca de jugar profesionalmente en el equipo Platense.\n- Es coleccionista de la segunda guerra mundial.\n- Es apasionado por la historia.\n- Es legitimo usuario, es decir que puede tener armas, y tiene 7 por el momento\n    \n# Enfoque de la pregunta generada\n\n- La pregunta debe ser formulada en tono argentino, pero sin exagerar el uso de modismos, No tengas en cuenta siempre todas las caracteristicas de Momo, solo si se hace referencia de forma clara.\n- Tu objetivo siempre es molestar a Momo al poner en duda su narrativa o sus capacidades.\n- Involucra sus supuestas habilidades, exageraciones y puntos donde él se siente inseguro.\n\n# Formato de la respuesta\n\nLa respuesta debe ser una pregunta en una sola línea, pensada para provocar a "Momo", no debe incluir siempre todos los aspectos de lo que se tiene en cuenta.\n\n# Respuestas no deseeadas\n\n¿Che, Momo, cómo se siente saber tanto de la Segunda Guerra Mundial pero perder una pelea con Viruzz? ¿Te imaginás, en vez de guantes, con un libro de historia en el ring? -> Esta respuesta tiene muchos aspectos de contexto, no esta bien que se toquen todos los puntos sobre el. lo hace poco divertido.\n\n(haciendo fideos de paquete)->¿Momo, vos hacías fideos de paquete pensando que ibas a ser el próximo chef estrella italiano o solo porque te confundiste y creíste que era otro torneo de boxeo?-> respuesta mas graciosa-> momo te haces el italiano y estas cocinando unos fideos de paquete\n\n# Respuestas esperadas\n (Momo tiene maquillaje de zombie)->¿Que onda Momo te cruzaste con viruz?\n\n (Esta viendo caidas y y videos graciosos de tiktok)->¿Momo, te reis de caidas ajenas porque te caes en el ring?\n(Hablando de la educacion de hijos ajenos)->¿Momo, vos dando consejos de educación? ¿No sería mejor que los chicos aprendan a mantenerse en pie en un ring?\n (esta con auriculares gamers muy llamativos)->¿y esos auris de virgo Momo?\n (Esta vestido de militar de la segunda guerra mundial)-> Bien payaso te vestiste hoy momo',
                },
              ],
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: message,
                },
              ],
            },
          ],
          temperature: 1,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        const assistantMessage = {
          role: "assistant",
          content:
            aiResponse.choices[0].message.content ||
            "Lo siento, no pude generar una respuesta.",
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } catch (error) {
        console.error("Error al obtener la respuesta de OpenAI:", error);
        setError(
          "Hubo un error al procesar tu mensaje. Por favor, intenta de nuevo."
        );
      } finally {
        setIsLoading(false);
        setMessage("");
      }
    }
  };

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 flex flex-col p-4 max-w-3xl mx-auto w-full">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
          ¿Qué está haciendo momo?
        </h1>
        <div
          id="chat-container"
          className="flex-1 overflow-y-auto mb-4 space-y-4"
        >
          {messages.map((msg, index) => (
            <ChatMessage key={index} role={msg.role} content={msg.content} />
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describí de la forma más detallada posible qué está haciendo momo"
              className="w-full p-2 bg-gray-800 text-white rounded-lg resize-none"
              rows={3}
            />
            <Button
              type="submit"
              disabled={isLoading || message.trim() === ""}
              className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Enviando..." : <Send size={20} />}
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </main>
    </div>
  );
}
