"use client"

import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  Folder,
  FileQuestion,
  BookOpen,
  Users,
  History
} from "lucide-react";


function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      id: "ai-chat",
      label: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "chats",
      label: "Chat",
      path: "/",
      icon: <MessageCircle size={20} />,
    },
    {
      id: "projects",
      label: "Category",
      path: "/category",
      icon: <Folder size={20} />,
    },
    {
      id: "templates",
      label: "Quiz",
      path: "/quiz",
      icon: <FileQuestion size={20} />,
    },
    {
      id: "resources",
      label: "Roadmap",
      path: "/roadmap",
      icon: <BookOpen size={20} />,
    },
    {
      id: "community",
      label: "Community",
      path: "/community",
      icon: <Users size={20} />,
      badge: "New",
    },
    {
      id: "history",
      label: "History",
      path: "/history",
      icon: <History size={20} />,
    },
  ]

  return (
    <div className="w-64 h-screen flex flex-col bg-white shadow">
      {/* Search input here */}

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                    isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                  }`}
                >
                  <span className={isActive ? "text-blue-600" : "text-gray-500"}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">{item.badge}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User profile footer here */}
    </div>
  )
}

export default Sidebar
