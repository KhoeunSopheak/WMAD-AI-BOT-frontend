import React, { useState, useEffect, useCallback } from "react";
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
import { ChartNoAxesCombined, Users, UserLock } from 'lucide-react';

export default function UserStatsChart() {
  const [startDate, setStartDate] = useState(new Date("2025-05-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [totalUser, setTotalUser] = useState(null);
  const [userBlock, setUserBlock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchUserStats = useCallback(async () => {
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
  }, [startDate, endDate]);

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
  }, [fetchUserStats]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-8xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">User Chart by Date</h2>
      <div className="flex flex-col md:flex-row justify-around mb-4 text-center gap-4">
        <div className="flex w-2/5 justify-center items-center gap-10 p-6 bg-[#2b53cc] border rounded-xl mx-4 my-8 shadow-xl">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
            <Users fontSize={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <p className="text-white text-sm">Total Users</p>
            <p className="text-2xl font-semibold text-white">{totalUser ?? "..."}</p>
          </div>
        </div>

        <div className="flex w-2/5 justify-center items-center gap-10 p-6 bg-[#E2424A] border rounded-xl mx-4 my-8 shadow-xl">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
            <UserLock fontSize={24} className="text-white" /> 
          </div>
          <div className="flex flex-col">
            <p className="text-white text-sm">Blocked Users</p>
            <p className="text-2xl font-semibold text-white">{userBlock ?? "..."}</p>
          </div>
        </div>

        <div className="flex w-2/5 items-center justify-center p-6 bg-white rounded-lg mx-4 my-8 shadow-lg">
          <div className="relative">
            <img
              src="https://bongsrey.sgp1.digitaloceanspaces.com/library/383/images/5d1ecb8986bbe.jpg"
              alt="Robot Character"
              className="h-40 w-full object-cover"
            />
          </div>
        </div>
      </div>
      
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
          className="bg-blue-600 text-white flex justify-center items-center gap-2 px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          <ChartNoAxesCombined /> Show Stats
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
            <Bar dataKey="totalUsers" fill="#2b53cc" name="Total Users" />
            <Bar dataKey="blockedUsers" fill="#E2424A" name="Blocked Users" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-400">No data available for selected date range.</p>
      )}
    </div>
  );
}
