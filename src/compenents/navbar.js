import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);

  const id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:3003/api/auth/${id}`, {
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
        console.log("User fetched successfully:", data.full_name);
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
      <div className="text-[#184f71] font-bold text-xl">WMAD GPT</div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-4 ">
            {user.avatar && user.avatar !== "/placeholder.svg" ? (
              <img
                src={user.avatar}
                alt={user.full_name || "Unknown"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold"
                style={{
                  backgroundColor: getColorByFirstLetter(user.full_name?.[0]),
                }}
              >
                {user.full_name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <span className="text-sm font-medium text-[#184f71]">
              {user.full_name || "Unknown User"}
            </span>
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
