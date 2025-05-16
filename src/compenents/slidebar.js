"use client";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  Folder,
  FileQuestion,
  BookOpen,
  Menu,
  History as HistoryIcon,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import logo from "../assets/wmadlogo.png";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // State for chat history
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
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

  const menuSections = [
    {
      title: "General",
      items: [
        ...(userRole === "admin"
          ? [{ id: 1, label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> }]
          : []),
        { id: 2, label: "ChatWMAD GPT", path: "/chat", icon: <MessageCircle size={20} /> },
      ]
    },
    {
      title: "Learning",
      items: [
        { id: 3, label: "Category", path: "/category", icon: <Folder size={20} /> },
        { id: 4, label: "Quiz", path: "/quiz", icon: <FileQuestion size={20} /> },
        { id: 5, label: "Roadmap", path: "/roadmap", icon: <BookOpen size={20} /> },
      ]
    },
  ];

  const handleClick = (chat) => {
    navigate(`/chat/${chat.id}`);
    setIsOpen(false); // close sidebar on mobile after click
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-2 bg-white rounded-full p-1 z-50">
        <button onClick={() => setIsOpen(true)} aria-label="Open Sidebar">
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        <div className="p-3">
          <div className="flex items-center justify-center w-40 h-10 rounded">
            <img src={logo} alt="Logo" />
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-6 flex flex-col h-[calc(100vh-80px)]">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx}>
              <h4 className="text-xs text-gray-400 font-semibold uppercase px-2 mb-1">{section.title}</h4>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          navigate(item.path);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-all ${
                          isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                        }`}
                      >
                        <span className={isActive ? "text-blue-600" : "text-gray-500"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Divider */}
          <div className="border-t pt-3">
            <h4 className="text-xs text-gray-400 font-semibold  uppercase px-2 mb-1 flex items-center space-x-1">
              <HistoryIcon size={16} />
              <span>Your Chat History</span>
            </h4>

            {loading ? (
              <p className="text-gray-600 px-2">Loading chat history...</p>
            ) : history.length === 0 ? (
              <p className="text-sm text-gray-500 italic px-2">No chat history available.</p>
            ) : (
              <ul className="space-y-2 max-h-[500px] overflow-y-auto">
                {history.map((chat, index) => {
                  const preview = chat.user_message?.slice(0, 80) || "No message available";
                  const time = chat.created_at
                    ? formatDistanceToNow(new Date(chat.created_at), { addSuffix: true })
                    : "Unknown time";

                  return (
                    <li
                      key={chat.id || index}
                      onClick={() => handleClick(chat)}
                      className="cursor-pointer bg-gray-50 p-2 rounded-md shadow-sm hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="text-blue-500 mt-1">
                          <MessageSquare size={16} />
                        </div>
                        <div>
                          <p className="text-gray-800 text-sm font-medium">{preview}...</p>
                          <p className="text-xs text-gray-500 mt-0.5">{time}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
