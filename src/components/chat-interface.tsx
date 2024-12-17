"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { ChatMessage } from "@/components/chat-message";
import OpenAI from "openai";
import { User } from "firebase/auth";
import { auth, provider, signInWithPopup, db } from "@/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Channel } from "@/types/kickChannel";
import { EditableDiv } from "./ui/EditableDiv";
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

  const [user, setUser] = useState<User | null>(null);
  const [usageCount, setUsageCount] = useState(0);

  const [momoData, setMomoData] = useState<Channel | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [docRef, setDocRef] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://kick.com/api/v2/channels/momoladinastia"
        );
        const data = await response.json();
        if (data.livestream !== null) {
          setIsLive(true);
        }
        setMomoData(data);
      } catch (error) {
        console.error("Error al obtener los datos del canal:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDoc = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          setUsageCount(userSnap.data().usageCount);
        } else {
          await setDoc(userDoc, { usageCount: 0 });
        }
      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        await setDoc(userDoc, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          usageCount: 0,
          createdAt: serverTimestamp(),
        });
      } else {
        await updateDoc(userDoc, {
          lastLogin: serverTimestamp(),
        });
      }
      setUser(user);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && user) {
      if (usageCount >= 5) {
        setError("Has alcanzado el límite de 5 usos por semana.");
        return;
      }
      setIsLoading(true);
      setError(null);
      const userMessage = {
        role: "user",
        content: message,
        timestamp: serverTimestamp(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

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
          timestamp: serverTimestamp(),
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);

        // Guardar el chat completo en Firestore
        const chatDocument = {
          userMessage,
          assistantMessage,
        };
        const userMessagesRef = collection(db, "users", user.uid, "messages");
        await addDoc(userMessagesRef, chatDocument).then((docRef) => {
          updateDoc(docRef, {
            id: docRef.id,
          });
          setDocRef(docRef.id);
          return docRef;
        });

        const userDoc = doc(db, "users", user.uid);
        await updateDoc(userDoc, { usageCount: increment(1) });
        setUsageCount((prevCount) => prevCount + 1);
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
    <div className="flex flex-col min-h-screen text-white transition-all duration-150">
      <main className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full justify-center">
        <div className=" flex flex-row-reverse flex-nowrap items-start justify-center content-start">
          <div className="flex flex-wrap flex-shrink justify-center items-center text-4xl md:text-6xl font-bold text-center mb-8">
            <span className="text-nowrap cursor-default">
              ¿Qué está haciendo
            </span>
            <span className="text-nowrap flex ms-2 cursor-pointer relative">
              <a
                className="relative"
                target="_blank"
                href="https://kick.com/momoladinastia"
              >
                momo
                {isLive ? (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 flex items-center gap-1 text-sm font-bold">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                    >
                      <path d="M4 19V28H7V22H16V28H28V19H4Z"></path>
                      <path d="M10.75 17.5C14.4775 17.5 17.5 14.4775 17.5 10.75C17.5 7.0225 14.4775 4 10.75 4C7.0225 4 4 7.0225 4 10.75C4 14.4775 7.0225 17.5 10.75 17.5ZM10.75 7C12.82 7 14.5 8.68 14.5 10.75C14.5 12.82 12.82 14.5 10.75 14.5C8.68 14.5 7 12.82 7 10.75C7 8.68 8.68 7 10.75 7Z"></path>
                      <path d="M23.5 17.5C25.9853 17.5 28 15.4853 28 13C28 10.5147 25.9853 8.5 23.5 8.5C21.0147 8.5 19 10.5147 19 13C19 15.4853 21.0147 17.5 23.5 17.5Z"></path>
                    </svg>
                    <span className="relative flex items-center gap-x-1 text-primary">
                      <span className="relative tabular-nums">
                        <div className="flex overflow-hidden text-kick-primary">
                          {momoData?.livestream.viewer_count}
                        </div>
                      </span>
                      <span className="text-subtle">Espectadores</span>
                    </span>
                  </div>
                ) : (
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 flex items-center p-0.5 text-nowrap text-xs font-medium text-center leading-none rounded-full px-2 bg-blue-900 text-blue-200">
                    Desconectado
                  </span>
                )}
              </a>
            </span>
            <span className="text-nowrap cursor-default">?</span>
          </div>
        </div>

        {!user ? (
          <Button variant={"google"} onClick={handleLogin}>
            <svg
              className="h-10 w-10"
              xmlns="http://www.w3.org/2000/svg"
              width="80px"
              height="80px"
              viewBox="0 0 32 32"
              data-name="Layer 1"
              id="Layer_1"
            >
              <path
                d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16"
                fill="#00ac47"
              />
              <path
                d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16"
                fill="#4285f4"
              />
              <path
                d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z"
                fill="#ffba00"
              />
              <polygon
                fill="#2ab2db"
                points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374"
              />
              <path
                d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z"
                fill="#ea4435"
              />
              <polygon
                fill="#2ab2db"
                points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626"
              />
              <path
                d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z"
                fill="#4285f4"
              />
            </svg>
            <p>Iniciar sesión con Google</p>
          </Button>
        ) : (
          <>
            <div className="text-center mb-4">
              <p>Usos restantes esta semana: {5 - usageCount}</p>
            </div>
            <div
              id="chat-container"
              className={`flex-1 overflow-y-auto mb-4 space-y-4  ${
                messages.length === 0 ? "max-h-0" : "max-h-full"
              }`}
            >
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  role={msg.role}
                  content={msg.content}
                  chatRef={docRef}
                  userUid={user?.uid}
                />
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
              <div className="flex items-center px-3 py-2 rounded-lg ">
                <EditableDiv
                  className="w-full p-2 bg-background text-white rounded-lg resize-none"
                  placeholder={`Describí de la forma más detallada posible ¿Qué está haciendo ${momoData?.user.username}?`}
                  onChange={(content) => setMessage(content)}
                ></EditableDiv>
                <Button
                  type="submit"
                  disabled={isLoading || message.trim() === ""}
                  className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Enviando...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 fill-kick-primary rotate-90 rtl:-rotate-90"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                      </svg>
                      <span className="sr-only">Enviando...</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        )}
      </main>
    </div>
  );
}
