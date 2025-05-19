import React from "react";
import { User, Bot } from "lucide-react";
import MessageBox from "./message-box";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 px-4`}>
      <div
        className={`flex items-start gap-3 max-w-[85%] ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar Icon */}
        <div
          className={`flex-shrink-0 p-2 rounded-full ${
            isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Message Bubble */}
        <div
          className={`p-3 rounded-lg whitespace-pre-wrap break-words ${
            isUser 
              ? "bg-blue-600 text-white rounded-tr-none" 
              : "bg-gray-100 text-gray-800 rounded-tl-none"
          }`}
        >
          <MessageBox message={message} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;