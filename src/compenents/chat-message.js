import React from "react";
import { User, Bot } from "lucide-react";
import MessageBox from "./message-box";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`flex items-start space-x-2 max-w-3/4 ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {/* Icon Container */}
        <div
          className={`p-2 rounded-full text-white ${
            isUser ? "bg-blue-800" : "bg-gray-600"
          }`}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Message Content */}
        <div
          className={`p-3 rounded-lg text-black ${
            isUser ? "bg-gray-200" : "bg-gray-300"
          }`}
        >
          <MessageBox message={message} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
