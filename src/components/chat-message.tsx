import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  role: string;
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
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
          className={`p-3 rounded-lg ${
            role === "user" ? "bg-blue-600 mr-2" : "bg-green-600 ml-2"
          }`}
        >
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </div>
  );
}
