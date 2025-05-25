import { useState, useEffect } from "react";
import { FaUser, FaUserSlash } from 'react-icons/fa';
import { LoaderPinwheel } from "lucide-react";
import UserStatsChart from "../compenents/Chart";

export default function DashboardSection() {
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

    fetchTotalUser();
    fetchUserBlock();

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
        <UserStatsChart/>
    </div>
  )
}

