import React from "react";
import { User, Bot } from "lucide-react";
import MessageBox from "../compenents/message-box"; // Make sure the path is correct

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  // Normalize message content
  const normalizedContent =
    Array.isArray(message.content)
      ? message.content.filter(Boolean).join("\n\n")
      : typeof message.content === "string" && message.content.trim() !== ""
      ? message.content
      : "[No content]";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 px-4`}>
      <div
        className={`flex items-start gap-3 max-w-[85%] ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 p-2 rounded-full ${
            isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Message */}
        <div
          className={`p-3 rounded-lg whitespace-pre-wrap break-words ${
            isUser
              ? " text-white rounded-tr-none"
              : " text-gray-800 rounded-tl-none"
          }`}
        >
          <MessageBox message={{ role: message.role, content: normalizedContent }} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
