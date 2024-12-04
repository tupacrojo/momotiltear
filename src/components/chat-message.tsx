import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React, { useState } from "react";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { EditableDiv } from "./ui/EditableDiv";

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
          <AvatarFallback>{role === "user" ? "TÚ" : "AI"}</AvatarFallback>
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
            <button onClick={handleEditClick}>Sugerencia</button>
          )}
          {isEditing && <button onClick={handleSaveClick}>Guardar</button>}
        </div>
      </div>
    </div>
  );
}
