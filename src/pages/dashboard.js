import { useState, useEffect } from "react";
import { FaUser, FaUserSlash } from 'react-icons/fa';
import { LoaderPinwheel } from "lucide-react";

export default function DashboardSection() {
  const [users, setUsers] = useState([]);
  const [totalUser, setTotalUser] = useState(null);
  const [userBlock, setUserBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchTotalUser = async () => {
      try {
        const response = await fetch("http://localhost:3003/api/auth/total", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch total user");
        }

        const result = await response.json();
        setTotalUser(result.total);
      } catch (error) {
        console.error("Error fetching total users:", error);
        alert("Failed to fetch total users.");
      }
    };

    const fetchUserBlock = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3003/api/users/blocks/total", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch total block");
        }

        const result = await response.json();
        setUserBlock(result.total);
      } catch (error) {
        console.error("Error fetching total block:", error);
        setError(error.message || "Failed to fetch total block.");
      }
    };

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3003/api/auth", {
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
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error.message || "Failed to fetch user.");
      }
    };


    fetchTotalUser();
    fetchUserBlock();
    fetchUser();

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col items-center">
          <LoaderPinwheel className="animate-spin"></LoaderPinwheel>
          <p className="mt-4 font-semibold">Loading, please wait...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-red-500 font-semibold">
        {error}
      </div>
    );


  return (
    <div className="space-y-2 p-6 h-full">
      {/* Amount Boxes at Top */}
      <div className="grid grid-cols-1 md:grid-cols-3 overflow-hidden bg-gradient-to-b rounded-lg">
        <div className="flex w-4/5 items-center justify-center p-6 bg-[#2620e3] border rounded-lg mx-4 my-8 shadow-lg">
          <div className="flex-1 flex justify-center mb-4">
            <FaUser className="text-white text-4xl" />
          </div>
          <div className="flex-1 flex flex-col justify-start items-start">
            <h4 className="text-3xl font-bold text-white">{totalUser}</h4>
            <p className="text-sm font-bold text-white mt-2">Total User</p>
          </div>
        </div>

        <div className="flex w-4/5 items-center justify-center p-6 bg-[#eba421] border rounded-lg mx-4 my-8 shadow-lg">
          <div className="flex-1 flex justify-center mb-4">
            <FaUserSlash className="text-white text-4xl" />
          </div>
          <div className="flex-1 flex flex-col justify-start items-start">
            <h4 className="text-3xl font-bold text-white">{userBlock}</h4>
            <p className="text-sm font-bold text-white mt-2">Total Block</p>
          </div>

        </div>
        <div className="flex w-4/5 items-center justify-center p-6 bg-white rounded-lg mx-4 my-8 shadow-lg">
          <div className="relative">
            <img
              src="https://bongsrey.sgp1.digitaloceanspaces.com/library/383/images/5d1ecb8986bbe.jpg"
              alt="Robot Character"
              className="h-40 w-full object-cover"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b rounded-lg -z-10"></div>
            <img
              src="https://static.vecteezy.com/system/resources/previews/052/513/913/non_2x/robot-ai-technology-character-icon-free-png.png"
              alt="Robot Character"
              className="h-32 w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Scrollable Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[650px] overflow-auto p-4 bg-white rounded-md shadow">
        {users.map((user, index) => (
          <div key={user.id} className="bg-gray-50 rounded-xl p-4 shadow border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              {user.avatar && user.avatar !== "/placeholder.svg" ? (
                <img
                  src={user.avatar}
                  alt={user.full_name || "Unknown"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: getColorByFirstLetter(user.full_name?.[0]) }}
                >
                  {user.full_name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div>
                <h2 className="text-[#184f71] font-semibold">{user.full_name || "Unknown"}</h2>
                <p className="text-sm text-blue-600">{user.email}</p>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              <p><span className="font-medium">User ID:</span> {index + 1}</p>
              <p><span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleString()}</p>
              <p><span className="font-medium">Updated:</span> {new Date(user.updated_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

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

