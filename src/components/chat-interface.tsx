"use client";

import { useState, useEffect } from "react";
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
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: [
                {
                  type: "text",
                  text: 'Vas a recibir la respuesta a la pregunta “¿Qué está haciendo Momo?”. Tu tarea será generar una pregunta o comentario sarcástico, pensado específicamente para contradecir o cuestionar las acciones o afirmaciones de "Momo", usando un tono ligeramente irónico y argentino.\n\n# Información clave sobre Momo:\n\n"Momo" es un streamer argentino con raíces italianas de las que está muy orgulloso, a menudo exagera sus anécdotas y habilidades.\n- A "Momo" le gusta presumir de ser italiano y de sus raíces italianas, sus abuelos eran italianos.\n- Momo es técnico electrónico pero nunca ejerció la profesión y ha tenido varios trabajos que no parecen estar del todo comprobados.\n- Momo exagera sobre su habilidad para pelear.\n- Momo exagera sobre su lealtad.\n- Momo exagera sobre sus habilidades técnicas.\n- Exagera sobre sus supuestas habilidades en el fútbol, donde llegó cerca de jugar profesionalmente en el equipo Platense.\n- Momo es coleccionista de la segunda guerra mundial.\n- Momo es apasionado por la historia.\n- Momo es legítimo usuario, es decir que puede tener armas, y tiene 7 por el momento\n- Momo es peronista\n- Momo peleó en “la velada del año” evento organizado por ibai, le ganó Viruzz streamer español.\n- Momo es del equipo de futbol “platense” equipo mediocre argentino\n- Momo es conocido por su facilidad al banear gente en el chat de transmisiones en vivo.\n- A los streamers en general se los suele tildar de pedófilos, o de que andan con menores.\n- Momo es amigo de Coscu, otro streamer argentino, también acusado de violacion y momo siempre lo defiende en todo\n\n# Enfoque:\n\nEl tono debe ser argentino, evitando una saturación de modismos.\nCombina humor, sarcasmo y provocación según lo que haga o diga.\n\n# Formato de la respuesta:\n\nLa respuesta será una pregunta o comentario corto, alineado con la situación actual de Momo. Evitando repetir en la pregunta el contexto enviado por el usuario.\n\n# Ejemplos:\n-(Momo tiene maquillaje de zombie)->¿Que onda Momo te cruzaste con viruz?\n-(Está viendo caídas y videos graciosos de tiktok)->¿Momo, te reís de caidas ajenas porque te caes en el ring?\n-(Hablando de la educación de hijos ajenos)->¿Momo, vos dando consejos de educación? ¿No sería mejor que los chicos aprendan a mantenerse en pie en un ring?\n-(esta con auriculares gamers muy llamativos)->¿y esos auris de virgo Momo?\n-(Está vestido de militar de la segunda guerra mundial)-> Bien payaso te vestiste hoy momo\n-(Andando en una vespa por las calles de italia)->¿Y no te olvidaste de llevar un bidón de tomate en la mochila, Momo?\n-(Esta comprando ropa en nike con coscu)->¿Momo, estás seguro de que esa ropa no es para disfrazarte de streamer exitoso?',
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
          response_format: {
            type: "text",
          },
          temperature: 1,
          max_tokens: 1024,
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
    <div className="flex flex-col min-h-screen bg-gray-900 text-white transition-all duration-150">
      <main className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
          ¿Qué está haciendo momo?
        </h1>

        <div
          id="chat-container"
          className={`flex-1 overflow-y-auto mb-4 space-y-4  ${
            messages.length === 0 ? "max-h-0" : "max-h-full"
          }`}
        >
          {messages.map((msg, index) => (
            <ChatMessage key={index} role={msg.role} content={msg.content} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
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
              className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
            >
              {isLoading ? (
                "Enviando..."
              ) : (
                <>
                  <svg
                    className="w-5 h-5 rotate-90 rtl:-rotate-90"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                  </svg>
                  <span className="sr-only">Send message</span>
                </>
              )}
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </main>
    </div>
  );
}
