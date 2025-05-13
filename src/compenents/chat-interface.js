import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import ChatMessage from "./chat-message";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { categoryTitle } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  
  console.log("=====>", messages);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (categoryTitle) {
      setSelectedCategory(categoryTitle);
      localStorage.setItem("selectedCategory", categoryTitle);
    } else {
      setSelectedCategory("");
      localStorage.removeItem("selectedCategory");
    }
  }, [categoryTitle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input, selectedCategory };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedCategory("");
    setIsLoading(true);

    // `${import.meta.env.VITE_BASE_URL}/api/users/chats/askQuery`

    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjljM2I5ZjE4LWNiNzYtNDU1Ny1hYTBiLWZkMzAyMGFiYjJiYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3MDU2MDUyLCJleHAiOjE3NDk2NDgwNTJ9.BK0BNvrLtdrrf0YTAPXBba4HUrZfjbEqTzlWe_k_dWY"
      // const token = localStorage.getItem("token");
      const response = await fetch( "http://localhost:3003/api/users/chats/askQuery",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            category: selectedCategory || null,
            user_message: input,
             isStream: true 
          }),
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
      <div className="flex flex-col w-full max-w-4xl">
        <main className="flex-1 overflow-auto p-4 space-y-4 w-full">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-4/5 text-center text-black pointer-events-none">
            <h1 className="text-3xl font-bold mb-4">{selectedCategory || "Hi, I'm WMAD GPT."}</h1>
             <p className="text-lg">
               How can i help you today?
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
            className="flex-1 p-2 h-16 border border-gray-300 rounded-l-xl focus:outline-none text-black"
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
