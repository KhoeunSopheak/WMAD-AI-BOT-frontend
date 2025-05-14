import { useState, useEffect } from "react";
import { FaUser, FaUserSlash } from 'react-icons/fa';

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
        console.log("Total users fetched successfully:", result);
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
          throw new Error("Failed to fetch user block");
        }

        const result = await response.json();
        console.log("User block fetched successfully:", result);
        setUserBlock(result.total);
      } catch (error) {
        console.error("Error fetching user block:", error);
        setError(error.message || "Failed to fetch user block.");
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
        console.log("User fetched successfully:", data);
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
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-500 font-semibold">Loading, please wait...</p>
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
      <div className="flex w-full overflow-hidden bg-gradient-to-b rounded-lg">
        <div className="flex w-3/5 items-center justify-between p-6 bg-blue-300 rounded-lg mx-4 my-8 shadow-lg">
          <div className="flex flex-col space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">Dicover your study with AI</h2>
            <h2 className="text-2xl font-bold text-gray-800">WMAD GPT</h2>

            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 flex items-center space-x-2">
              <span>Be the first</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
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

        <div className="flex w-2/5 items-center justify-center p-6 bg-white rounded-lg mx-4 my-8 shadow-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-400 rounded-lg -z-10"></div>
            <img
              src="https://bongsrey.sgp1.digitaloceanspaces.com/library/383/images/5d1ecb8986bbe.jpg"
              alt="Robot Character"
              className="h-40 w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-md p-4 rounded-md">
        <div className="flex justify-center items-center bg-blue-800 p-6 rounded-md shadow text-center">
          <div className="flex-1 flex justify-center mb-4">
            <FaUser className="text-white text-4xl" />
          </div>
          <div className="flex-1 flex flex-col justify-start items-start">
            <h4 className="text-3xl font-bold text-white">{totalUser}</h4>
            <p className="text-sm font-bold text-white mt-2">Total User</p>
          </div>

        </div>

        <div className="flex justify-center items-center bg-orange-600 p-6 rounded-md shadow text-center">
          <div className="flex-1 flex justify-center mb-4">
            <FaUserSlash className="text-white text-4xl" />
          </div>
          <div className="flex-1 flex flex-col justify-start items-start">
            <h4 className="text-3xl font-bold text-white">{userBlock}</h4>
            <p className="text-sm font-bold text-white mt-2">Total Block</p>
          </div>

        </div>
      </div>

      {/* Scrollable Table */}
      <div className="bg-white shadow rounded-md overflow-auto max-h-[650px]">
        <table className="min-w-full">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="py-3 px-6 text-left">User ID</th>
              <th className="py-3 px-6 text-left">Full Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Created At</th>
              <th className="py-3 px-6 text-left">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-4 px-6">{user.id}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    {user.avatar && user.avatar !== "/placeholder.svg" ? (
                      <img
                        src={user.avatar}
                        alt={user.full_name || "Unknown"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: getColorByFirstLetter(user.full_name?.[0]) }}
                      >
                        {user.full_name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span>{user.full_name || "Unknown"}</span>
                  </div>
                </td>

                <td className="py-4 px-6">{user.email}</td>
                <td className="py-4 px-6">{user.created_at}</td>
                <td className="py-4 px-6">{user.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

