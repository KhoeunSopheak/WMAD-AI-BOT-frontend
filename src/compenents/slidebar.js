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
  History
} from "lucide-react";
import logo from "../assets/wmadlogo.png";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
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
    {
      title: "Your History",
      items: [{ id: 6, label: "History", path: "/history", icon: <History size={20} /> }]
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-2  bg-white rounded-full p-1">
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

        <div className="overflow-y-auto p-4 space-y-6">
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
                          setIsOpen(false); // Close on mobile
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

          <div className="text-sm text-gray-500 border-t pt-3 px-3 italic">
            <strong>History:</strong> View your past activity here.
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
