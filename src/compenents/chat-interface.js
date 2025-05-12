import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import ChatMessage from "./chat-message";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/chat/askQuery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: input, isStream: true }),
        }
      );

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const aiMessage = { role: "assistant", content: "" };
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        aiMessage.content += chunk;
        if (isFirstChunk) {
          isFirstChunk = false;
          setMessages((prev) => [...prev, { ...aiMessage }]);
        } else {
          setMessages((prev) => [...prev.slice(0, -1), { ...aiMessage }]);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center h-full text-white">
      <div className="flex flex-col w-full max-w-3xl">
        <main className="flex-1 overflow-auto p-4 space-y-4 w-full">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 text-center text-[#184f71] pointer-events-none">
            <h1 className="text-3xl font-bold mb-4">Welcome to WMAD!</h1>
             <p className="text-lg max-w-md">
               Start a conversation by typing your message below. We're excited to chat with you!
             </p>
          </div>
          )}
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </main>
        <form onSubmit={handleSubmit} className="flex items-center p-4 border-gray-2000">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 h-16 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-blue-600 p-4 h-16 rounded-r-xl disabled:bg-blue-800"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
