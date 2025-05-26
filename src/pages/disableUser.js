import { useState, useEffect } from "react";
import { LoaderPinwheel } from "lucide-react";

export default function UserLock() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchUserLock = async () => {
            try {
                const response = await fetch("http://localhost:3003/api/users/blocks", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user lock");
                }

                const data = await response.json();
                setUsers(data.blocks);
            } catch (error) {
                console.error("Error fetching user lock:", error);
                setError(error.message || "Failed to fetch user lock.");
            }
        };
        fetchUserLock();


        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleDisableUser = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/blocks/remove/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to disable user.");
            }
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Error disabling user:", error);
            alert(error.message || "Something went wrong.");
        }
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
                            <th className="py-3 px-6 text-left">User name</th>
                            <th className="py-3 px-6 text-left">User ID</th>
                            <th className="py-3 px-6 text-left">Message</th>
                            <th className="py-3 px-6 text-left">Created At</th>
                            <th className="py-3 px-6 text-left">Updated At</th>
                            <th className="py-3 px-6 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <div className=" text-center text-gray-600 mt-8">
                            <p className="text-lg font-semibold">There are no user block.</p>
                          </div>
                        ) : (users.map((user, index) => (
                            <tr key={user.id} className="border-b hover:bg-blue-100 hover:shadow-lg">
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
                                <td className="py-4 px-6">{user.user_id}</td>
                                <td className="py-4 px-6 text-red-600">{user.user_message}</td>
                                <td className="py-4 px-6">{new Date(user.created_at).toLocaleString()}</td>
                                <td className="py-4 px-6">{new Date(user.updated_at).toLocaleString()}</td>
                                <td className="py-4 px-6">
                                    <button
                                        onClick={() => handleDisableUser(user.id)}
                                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                                    >
                                        Disable
                                    </button>
                                </td>
                            </tr>
                        )))}
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

