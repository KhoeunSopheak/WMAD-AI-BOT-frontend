import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { ChartNoAxesCombined, Users, UserLock } from 'lucide-react';

const baseUrl = process.env.REACT_APP_BASE_URL;
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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
        `${baseUrl}/api/auth/stats?start=${startDate.toISOString().split("T")[0]}&end=${endDate.toISOString().split("T")[0]}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch user stats");

      const data = await res.json();
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
        const response = await fetch(`${baseUrl}/api/auth/total`, {
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
      try {
        const response = await fetch(`${baseUrl}/api/users/blocks/total`, {
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

  // Prepare data for Chart.js
  const barChartData = {
    labels: chartData.map((d) => d.date),
    datasets: [
      {
        label: "Total Users",
        data: chartData.map((d) => d.totalUsers),
        backgroundColor: "#2b53cc",
      },
      {
        label: "Blocked Users",
        data: chartData.map((d) => d.blockedUsers),
        backgroundColor: "#E2424A",
      },
    ],
  };

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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newDate) => setStartDate(newDate)}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newDate) => setEndDate(newDate)}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </LocalizationProvider>

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
        <div className="w-full h-[400px] px-3">
          <Bar data={barChartData} />
        </div>

      ) : (
        <p className="text-center text-gray-400">No data available for selected date range.</p>
      )}
    </div>
  );
}
