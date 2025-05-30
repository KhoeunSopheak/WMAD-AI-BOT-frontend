import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL;
function Navbar() {
  const [user, setUser] = useState(null);

  const id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${baseUrl}/api/auth/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data || null);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  function getColorByFirstLetter(letter) {
    const colors = {
      A: "#EF4444", // Red
      B: "#F97316", // Orange
      C: "#FACC15", // Yellow
      D: "#22C55E", // Green
      E: "#3B82F6", // Blue
      F: "#8B5CF6", // Purple
      G: "#EC4899", // Pink
      H: "#14B8A6", // Teal
      I: "#06B6D4", // Cyan
      J: "#10B981", // Emerald
      K: "#F59E0B", // Amber
      L: "#84CC16", // Lime
      M: "#E879F9", // Fuchsia
      N: "#A855F7", // Violet
      O: "#0EA5E9", // Sky
      P: "#4ADE80", // Light Green
      Q: "#F43F5E", // Rose
      R: "#6366F1", // Indigo
      S: "#10B981", // Green
      T: "#3B82F6", // Blue
      U: "#F59E0B", // Orange
      V: "#84CC16", // Lime
      W: "#F472B6", // Pink
      X: "#8B5CF6", // Purple
      Y: "#22D3EE", // Cyan
      Z: "#F87171", // Red
    };

    const upperLetter = letter?.toUpperCase() || "U";
    return colors[upperLetter] || "#6B7280";
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="hidden sm:block text-[#184f71] font-bold text-xl">
        WMAD GPT
      </div>
      <div className="flex items-center justify-end gap-4 w-full sm:w-auto">
        {user && (
          <div className="flex items-center gap-3 sm:gap-4">
            {user.avatar && user.avatar !== "/placeholder.svg" ? (
              <img
                src={user.avatar}
                alt={user.full_name || "Unknown"}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{
                  backgroundColor: getColorByFirstLetter(user.full_name?.[0]),
                }}
              >
                {user.full_name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex flex-col">
            <span className="hidden sm:inline text-lg font-medium text-black whitespace-nowrap truncate max-w-[120px] sm:max-w-none">
              {user.full_name || "Unknown User"}
            </span>
            <span className="text-sm">{user.email}</span>
            </div>
          </div>
        )}
        <Link to="/">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-[#184f71] hover:text-blue-600"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
