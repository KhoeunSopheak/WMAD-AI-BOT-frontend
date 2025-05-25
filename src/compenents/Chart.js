import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function UserStatsChart() {
  const [startDate, setStartDate] = useState(new Date("2025-05-20"));
  const [endDate, setEndDate] = useState(new Date("2025-05-24"));
  const [chartData, setChartData] = useState([]);
  const [totalUser, setTotalUser] = useState(null);
  const [userBlock, setUserBlock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(totalUser, userBlock)

  const fetchUserStats = async () => {
    if (!startDate || !endDate) return;
  
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
  
      const res = await fetch(
        `http://localhost:3003/api/auth/stats?start=${startDate.toISOString().split("T")[0]}&end=${endDate.toISOString().split("T")[0]}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!res.ok) throw new Error("Failed to fetch user stats");
  
      const data = await res.json();
      console.log(data)
  
      setChartData(data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };
  
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
    fetchUserStats();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-8xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">📊 User Stats by Date</h2>

      {/* Summary Stats */}
      <div className="flex flex-col md:flex-row justify-around mb-4 text-center gap-4">
        <div className="flex flex-col w-2/5 items-center justify-center p-6 bg-blue-600 border rounded-lg mx-4 my-8 shadow-lg">
          <p className="text-white text-sm">Total Users</p>
          <p className="text-xl text-white font-bold">{totalUser ?? "..."}</p>
        </div>
        <div className="flex flex-col w-2/5 items-center justify-center p-6 bg-red-600 border rounded-lg mx-4 my-8 shadow-lg">
          <p className="text-white text-sm">Blocked Users</p>
          <p className="text-xl font-bold text-white">{userBlock ?? "..."}</p>
        </div>
        <div className="flex w-2/5 items-center justify-center p-6 bg-white rounded-lg mx-4 my-8 shadow-lg">
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

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="text-sm font-medium text-gray-600">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="border p-2 rounded text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border p-2 rounded text-sm"
          />
        </div>

        <button
          onClick={fetchUserStats}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          📈 Show Stats
        </button>
      </div>

      {/* Chart or State Messages */}
      {loading ? (
        <p className="text-center text-gray-500">Loading chart...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalUsers" fill="#2563eb" name="Total Users" />
            <Bar dataKey="blockedUsers" fill="#dc2626" name="Blocked Users" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-400">No data available for selected date range.</p>
      )}
    </div>
  );
}
