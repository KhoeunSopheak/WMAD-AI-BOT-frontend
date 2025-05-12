import { useState, useEffect } from "react";
import { FaUser, FaUserSlash } from 'react-icons/fa';

export default function DashboardSection() {
  const [users, setUsers] = useState([]);
  const [totalUser, setTotalUser] = useState(null);
  const [userBlock, setUserBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect( () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjljM2I5ZjE4LWNiNzYtNDU1Ny1hYTBiLWZkMzAyMGFiYjJiYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3MDU2MDUyLCJleHAiOjE3NDk2NDgwNTJ9.BK0BNvrLtdrrf0YTAPXBba4HUrZfjbEqTzlWe_k_dWY"
      // const token = localStorage.getItem("token");
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
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjljM2I5ZjE4LWNiNzYtNDU1Ny1hYTBiLWZkMzAyMGFiYjJiYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3MDU2MDUyLCJleHAiOjE3NDk2NDgwNTJ9.BK0BNvrLtdrrf0YTAPXBba4HUrZfjbEqTzlWe_k_dWY"
      // const token = localStorage.getItem("token");
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
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjljM2I5ZjE4LWNiNzYtNDU1Ny1hYTBiLWZkMzAyMGFiYjJiYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3MDU2MDUyLCJleHAiOjE3NDk2NDgwNTJ9.BK0BNvrLtdrrf0YTAPXBba4HUrZfjbEqTzlWe_k_dWY"
      // const token = localStorage.getItem("token");
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
        setUsers(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error.message || "Failed to fetch user.");
      }
    };
 
    

    // const fakeTasks = [
    //   { id: 1, creator: { name: "Sopheak", avatar: "/placeholder.svg" }, task: "Design dashboard UI", status: "In Progress", priority: "High", lastUpdate: "2025-05-10" },
    //   { id: 2, creator: { name: "Kunthea", avatar: "/placeholder.svg" }, task: "Fix login bug", status: "Done", priority: "Medium", lastUpdate: "2025-05-09" },
    //   { id: 3, creator: { name: "Reach", avatar: "/placeholder.svg" }, task: "Set up database", status: "In Review", priority: "High", lastUpdate: "2025-05-08" },
    //   { id: 4, creator: { name: "Rak", avatar: "/placeholder.svg" }, task: "Update user profile page", status: "Done", priority: "Low", lastUpdate: "2025-05-07" },
    //   { id: 5, creator: { name: "Rong", avatar: "/placeholder.svg" }, task: "Create API for reports", status: "In Progress", priority: "Medium", lastUpdate: "2025-05-06" },
    //   { id: 1, creator: { name: "Sopheak", avatar: "/placeholder.svg" }, task: "Design dashboard UI", status: "In Progress", priority: "High", lastUpdate: "2025-05-10" },
    //   { id: 2, creator: { name: "Kunthea", avatar: "/placeholder.svg" }, task: "Fix login bug", status: "Done", priority: "Medium", lastUpdate: "2025-05-09" },
    //   { id: 3, creator: { name: "Reach", avatar: "/placeholder.svg" }, task: "Set up database", status: "In Review", priority: "High", lastUpdate: "2025-05-08" },
    //   { id: 4, creator: { name: "Rak", avatar: "/placeholder.svg" }, task: "Update user profile page", status: "Done", priority: "Low", lastUpdate: "2025-05-07" },
    //   { id: 5, creator: { name: "Rong", avatar: "/placeholder.svg" }, task: "Create API for reports", status: "In Progress", priority: "Medium", lastUpdate: "2025-05-06" },
    // ];

    fetchTotalUser();
    fetchUserBlock();
    fetchUser();

    setTimeout(() => {
      // setUsers(fakeTasks);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="w-full h-full flex justify-center items-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Amount Boxes at Top */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex justify-center items-center bg-blue-800 p-6 rounded-md shadow text-center">
          <div className="flex-1 flex justify-center mb-4">
            <FaUser className="text-white text-4xl" />
          </div>
          <div className="flex-1 flex flex-col justify-start items-start">
            <h4 className="text-3xl font-bold text-white">{totalUser}</h4>
            <p className="text-sm font-bold text-white mt-2">User</p>
          </div>

        </div>

        <div className="flex justify-center items-center bg-orange-600 p-6 rounded-md shadow text-center">
          <div className="flex-1 flex justify-center mb-4">
            <FaUserSlash className="text-white text-4xl" />
          </div>
          <div className="flex-1 flex flex-col justify-start items-start">
            <h4 className="text-3xl font-bold text-white">{userBlock}</h4>
            <p className="text-sm font-bold text-white mt-2">Block</p>
          </div>

        </div>
      </div>

      {/* Scrollable Table */}
      <div className="bg-white shadow rounded-md overflow-auto max-h-[400px]">
        <table className="min-w-full">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="py-3 px-6 text-left">User name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Create At</th>
              <th className="py-3 px-6 text-left">Last update</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    {user.full_name && user.full_name !== "/placeholder.svg" ? (
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

                <td className="py-4 px-6">{user.full_name}</td>
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

