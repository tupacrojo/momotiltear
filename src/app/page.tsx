"use client";
import ChatInterface from "@/components/chat-interface";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function Home() {
  function handleLogout() {
    signOut(auth)
      .then(() => {
        window.location.reload();
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
        className="fixed bottom-5 right-5 px-4 py-2 bg-red-500 text-white border-none rounded cursor-pointer"
      >
        Logout
      </button>
    </>
  );
}
