import React, { useState, useRef, useEffect } from "react";
import { Send, LoaderPinwheel } from "lucide-react";
import { useParams } from "react-router-dom";
import ChatMessage from "../compenents/chat-message";

const baseUrl = process.env.REACT_APP_BASE_URL;
const ChatHistory = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch existing chat history
  useEffect(() => {
    const fetchChat = async () => {
      setIsInitialLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseUrl}/api/users/chats/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch chat");

        const data = await response.json();
        
        const chat = data.chat || {};
        const history = chat.history;
        let formattedMessages = [];

        if (Array.isArray(history)) {
          formattedMessages = history
            .map((msg) => {
              if (!msg.content) return null; // skip empty content
              return {
                role: msg.role === "user" ? "user" : "assistant",
                content: Array.isArray(msg.content)
                  ? msg.content.join("\n")
                  : String(msg.content || ""),
              };
            })
            .filter(Boolean);
        } else if (Array.isArray(chat.user_message) && Array.isArray(chat.ai_response)) {
          const userMessages = chat.user_message;
          const aiMessages = chat.ai_response;

          const minLength = Math.min(userMessages.length, aiMessages.length);
          for (let i = 0; i < minLength; i++) {
            if (userMessages[i]) {
              formattedMessages.push({ role: "user", content: String(userMessages[i]) });
            }
            if (aiMessages[i]) {
              formattedMessages.push({ role: "assistant", content: String(aiMessages[i]) });
            }
          }
        }

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch chat:", error);
        setMessages([]);
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (id) fetchChat();
  }, [id]);

  // Handle message send and streaming AI response
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}/api/users/chats/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_message: input,
          isStream: true,
        }),
      });

      if (!response.body) throw new Error("ReadableStream not supported or missing response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiContent = "";
      let isFirstChunk = true;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
      
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          aiContent += chunk;
      
          const currentContent = aiContent; // capture stable value to use in setMessages
      
          if (isFirstChunk) {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: currentContent },
            ]);
            isFirstChunk = false;
          } else {
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: "assistant",
                content: currentContent,
              };
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error("Message error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, I encountered an error." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center h-full text-gray-900">
      <div className="flex flex-col w-full max-w-4xl">
        <main className="flex-1 overflow-auto p-4 space-y-4">
          {isInitialLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <LoaderPinwheel className="w-12 h-12 animate-spin mb-4 text-gray-400" />
              <h1 className="text-xl font-semibold">Loading chat...</h1>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)
          )}
          <div ref={messagesEndRef} />
        </main>

        <form onSubmit={handleSubmit} className="flex items-center p-4">
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
