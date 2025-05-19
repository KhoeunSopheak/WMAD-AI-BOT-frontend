import React, { useState, useRef, useEffect } from "react";
import { Send, LoaderPinwheel } from "lucide-react";
import { useParams } from "react-router-dom";
import ChatMessage from "./chat-message";

const ChatHistory = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch existing chat history
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3003/api/users/chats/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        let formattedMessages = [];

        // ✅ Format: full history exists
        if (data.chat?.history && Array.isArray(data.chat.history)) {
          formattedMessages = data.chat.history;
        }
        // ✅ Fallback: One question and answer
        else if (data.chat?.user_message && data.chat?.ai_response) {
          formattedMessages = [
            { role: "user", content: data.chat.user_message },
            { role: "assistant", content: data.chat.ai_response },
          ];
        }

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch chat:", error);
      }
    };

    if (id) fetchChat();
  }, [id]);

  // Handle message send and AI response stream
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
        `http://localhost:3003/api/users/chats/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_message: input,
            isStream: true,
          }),
        }
      );

      if (!response.body) throw new Error("No response body received");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessage = { role: "assistant", content: "" };

      // Push empty assistant message
      setMessages((prev) => [...prev, aiMessage]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        if (value) {
          const chunk = decoder.decode(value);
          aiMessage.content += chunk;

          // Update last message
          setMessages((prevMessages) => {
            const updated = [...prevMessages];
            updated[updated.length - 1] = { ...aiMessage };
            return updated;
          });
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, I encountered an error." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center h-full bg-white text-gray-900">
      <div className="flex flex-col w-full max-w-4xl h-[90vh] border border-gray-300 rounded-lg shadow-md">
        <main className="flex-1 overflow-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <LoaderPinwheel className="w-12 h-12 animate-spin mb-4 text-gray-400" />
              <h1 className="text-xl font-semibold">Loading chat...</h1>
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))
          )}
          <div ref={messagesEndRef} />
        </main>

        <form
          onSubmit={handleSubmit}
          className="flex items-center p-4 border-t border-gray-300"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-4 h-16 border border-gray-300 rounded-l-xl focus:outline-none"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-gray-300 p-4 h-16 rounded-r-xl disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderPinwheel className="animate-spin text-gray-700" />
            ) : (
              <Send className="text-gray-700" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatHistory;
