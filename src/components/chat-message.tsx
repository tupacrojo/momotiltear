import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React, { useState } from "react";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { EditableDiv } from "./ui/EditableDiv";

import Image from "next/image";
import { auth } from "@/firebaseConfig";

interface ChatMessageProps {
  role: string;
  content: string;
  chatRef: string;
  userUid: string; // Añade el UID del usuario como prop
}

export function ChatMessage({
  role,
  content,
  chatRef,
  userUid,
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    await saveSuggestion(userUid, chatRef, editedContent);
  };

  const handleShareClick = async () => {
    await handleShare(chatRef, userUid);
  };

  const saveSuggestion = async (
    userUid: string,
    chatRef: string,
    content: string
  ) => {
    try {
      const messageRef = doc(
        collection(db, "users", userUid, "messages"),
        chatRef
      );
      await updateDoc(messageRef, {
        suggestionMessage: {
          content: content,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error("Error al guardar la sugerencia: ", error);
    }
  };

  const handleShare = async (chatRef: string, userUid: string) => {
    try {
      const messageRef = doc(
        collection(db, "users", userUid, "messages"),
        chatRef
      );

      const publicConversation = {
        messageRef,
        users: [userUid],
        likes: 0,
        metadata: {
          originalUserId: userUid,
          sharedAt: serverTimestamp(),
        },
      };

      await addDoc(collection(db, "public_conversations"), publicConversation);
    } catch (error) {
      console.error("Error al compartir la conversación: ", error);
    }
  };

  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-start ${
          role === "user" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <Avatar className={role === "user" ? "bg-blue-500" : "bg-green-500"}>
          <AvatarFallback>
            {role === "user" ? (
              auth.currentUser?.photoURL ? (
                <Image
                  src={auth.currentUser?.photoURL}
                  width={800}
                  height={800}
                  alt="perfil"
                />
              ) : (
                "TU"
              )
            ) : (
              "AI"
            )}
          </AvatarFallback>
        </Avatar>
        <div
          className={`min-w-full p-3 rounded-lg ${
            role === "user" ? "bg-blue-600 mr-2" : "bg-green-600 ml-2"
          }`}
        >
          {isEditing ? (
            <EditableDiv
              value={editedContent}
              onChange={(e) => setEditedContent(e)}
            />
          ) : (
            <p>{content}</p>
          )}
          {role === "assistant" && !isEditing && (
            <div className="flex">
              <button onClick={handleEditClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  width="80px"
                  height="80px"
                  viewBox="0 0 24 24"
                  className="group relative box-border flex shrink-0 grow-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded font-semibold ring-0 transition-all focus-visible:outline-none active:scale-[0.95] disabled:pointer-events-none [&amp;_svg]:size-[1em] bg-transparent focus-visible:outline-grey-300 text-white [&amp;_svg]:fill-current betterhover:hover:bg-surface-tint lg:data-[state=open]:bg-surface-tint data-[state=active]:bg-surface-tint disabled:text-grey-600 disabled:bg-grey-1000 size-10 text-base leading-none"
                >
                  <path
                    id="secondary"
                    d="M12,3V4m7.07,1.93-.71.71M4.93,5.93l.71.71"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                  <path
                    id="primary"
                    d="M17,13a5,5,0,0,0-9.91-.93,4.89,4.89,0,0,0,1,4A4,4,0,0,1,9,18.62V20a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V18.62a3.94,3.94,0,0,1,.89-2.5A4.93,4.93,0,0,0,17,13Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
              <button
                onClick={handleShareClick}
                className="group relative box-border flex shrink-0 grow-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded font-semibold ring-0 transition-all focus-visible:outline-none active:scale-[0.95] disabled:pointer-events-none [&amp;_svg]:size-[1em] bg-transparent focus-visible:outline-grey-300 text-white [&amp;_svg]:fill-current betterhover:hover:bg-surface-tint lg:data-[state=open]:bg-surface-tint data-[state=active]:bg-surface-tint disabled:text-grey-600 disabled:bg-grey-1000 size-10 text-base leading-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80px"
                  height="80px"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 12C9 13.3807 7.88071 14.5 6.5 14.5C5.11929 14.5 4 13.3807 4 12C4 10.6193 5.11929 9.5 6.5 9.5C7.88071 9.5 9 10.6193 9 12Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M14 6.5L9 10"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M14 17.5L9 14"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M19 18.5C19 19.8807 17.8807 21 16.5 21C15.1193 21 14 19.8807 14 18.5C14 17.1193 15.1193 16 16.5 16C17.8807 16 19 17.1193 19 18.5Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M19 5.5C19 6.88071 17.8807 8 16.5 8C15.1193 8 14 6.88071 14 5.5C14 4.11929 15.1193 3 16.5 3C17.8807 3 19 4.11929 19 5.5Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                </svg>
              </button>
            </div>
          )}
          {isEditing && <button onClick={handleSaveClick}>Guardar</button>}
        </div>
      </div>
    </div>
  );
}
