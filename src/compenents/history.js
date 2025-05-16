import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:3003/api/users/chats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok && data.chat) {
          setHistory(data.chat);
        } else {
          console.error("Failed to load history:", data.message || data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleClick = (chat) => {
    navigate(`/chat/${chat.id}`); // Use `id` from your backend response
  };

  return (
    <div className="p-6 md:ml-64 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Chat History</h1>

      {loading ? (
        <p className="text-gray-600">Loading chat history...</p>
      ) : history.length === 0 ? (
        <p className="text-sm text-gray-500 border-t pt-3 px-3 italic font-light">No chat history available.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((chat, index) => {
            const preview = chat.user_message?.slice(0, 80) || "No message available";
            const time = chat.created_at
              ? formatDistanceToNow(new Date(chat.created_at), { addSuffix: true })
              : "Unknown time";

            return (
              <li
                key={chat.id || index}
                onClick={() => handleClick(chat)}
                className="cursor-pointer bg-white p-4 rounded-xl shadow hover:bg-blue-50 transition-all"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-blue-500 mt-1">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{preview}...</p>
                    <p className="text-xs text-gray-500 mt-1">{time}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default History;
