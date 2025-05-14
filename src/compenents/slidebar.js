"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  MessageCircle,
  Folder,
  FileQuestion,
  BookOpen,
  Menu,
  History
} from "lucide-react"

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role)
  }, [])

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
    {
      title: "Your History",
      items: [{ id: 6, label: "History", path: "/history", icon: <History size={20} /> }]
    }
  ]

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-2 bg-black shadow">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full z-40 bg-white shadow transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} w-64 md:translate-x-0`}
      >
        <div className="flex-1 overflow-y-auto p-4 pt-16 md:pt-4">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="mb-4">
              <h4 className="text-xs text-gray-400 font-semibold uppercase px-2 mb-1">{section.title}</h4>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          navigate(item.path)
                          setIsOpen(false) // close on mobile
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-all ${
                          isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                        }`}
                      >
                        <span className={isActive ? "text-blue-600" : "text-gray-500"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          {/* Static text below nav */}
          <div className="mt-6 px-3 text-gray-500 text-sm italic border-t pt-3">
            <strong>History:</strong> View your past activity and visited content here.
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar;
