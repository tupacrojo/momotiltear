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
            <>
              <button onClick={handleEditClick}>Sugerencia</button>
              <button onClick={handleShareClick}>Compartir</button>
            </>
          )}
          {isEditing && <button onClick={handleSaveClick}>Guardar</button>}
        </div>
      </div>
    </div>
  );
}
