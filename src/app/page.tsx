"use client";
import ChatInterface from "@/components/chat-interface";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function Home() {
  function handleLogout() {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  }
  return (
    <>
      <ChatInterface />
      <button
        onClick={handleLogout}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </>
  );
}
