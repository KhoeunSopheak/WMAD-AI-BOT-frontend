import { useState, useEffect } from "react";
import { LoaderPinwheel } from "lucide-react";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUser = async () => {
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

    fetchUser();

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleDisableUser = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3003/api/auth/disable/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, is_disabled: true } : user
      )
    );
  };

  const handleEnableUser = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3003/api/auth/enable/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, is_disabled: false } : user
      )
    );
  };


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
      <div className="bg-white shadow rounded-md overflow-auto h-screen">
        <table className="min-w-full">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="py-3 px-6 text-left">No</th>
              <th className="py-3 px-6 text-left">Full Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Created At</th>
              <th className="py-3 px-6 text-left">Updated At</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-b">
                <td className="py-4 px-6">{index + 1}</td>
                <td className="py-4 px-6 text-[#184f71] font-medium">
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
                <td className="py-4 px-6">{new Date(user.created_at).toLocaleString()}</td>
                <td className="py-4 px-6">{new Date(user.updated_at).toLocaleString()}</td>
                <td className="py-4 px-6">
                  {user.is_disabled ? (
                    <button
                      onClick={() => handleEnableUser(user.id)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-800"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDisableUser(user.id)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-800"
                    >
                      Enable
                    </button>
                  )}
                </td>

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

