import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Form to add new roadmap
const AddRoadmapForm = ({ onAddItem, token }) => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3003/api/users/roadmaps/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title: topic }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate roadmap");
      }

      const data = await response.json();
      const roadmap = data.roadmaps.roadmap;

      onAddItem({
        id: roadmap.id,
        title: roadmap.title,
        children: roadmap.milestone.map((milestone, index) => ({
          id: `${roadmap.id}-${index}`,
          title: milestone,
        })),
      });

      setTopic("");
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex gap-2">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a learning topic..."
        className="flex-grow border p-2 rounded"
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "..." : "+"}
      </button>
    </form>
  );
};

const RoadMap = () => {
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA2MmNjZjkzLWE1MzktNDFjMC1hNjEyLWEyODA0YzBiMzc4NCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3MDk1NjM3LCJleHAiOjE3NDk2ODc2Mzd9.aH3QrZ3B8hzpDki_7m6SP5zXA6FAVPHc_8ctSHwKoYM";

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle adding a new roadmap item
  const handleAddRoadmapItem = (newItem) => {
    setRoadmapItems((prev) => [...prev, newItem]);
  };

  // Fetch all roadmap data on load
  useEffect(() => {
    const fetchAllRoadmaps = async () => {
      try {
        const response = await fetch("http://localhost:3003/api/users/roadmaps", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch all roadmaps");
        }
  
        const data = await response.json();
        console.log("Fetched Data:", data); // Log the entire response
  
        // Ensure 'roadmaps' exists and is an array
        if (data && Array.isArray(data.roadmaps)) {
          const allRoadmaps = data.roadmaps.map((r) => ({
            id: r.id,
            title: r.title,
            children: r.milestone ? r.milestone.map((m, index) => ({
              id: `${r.id}-${index}`,
              title: m,
            })) : [], // Handle case if 'milestone' is missing
          }));
  
          console.log("Mapped Roadmaps:", allRoadmaps); // Log the mapped roadmaps
          setRoadmapItems(allRoadmaps);
        } else {
          console.error("Invalid data format or 'roadmaps' is missing");
        }
      } catch (error) {
        console.error("Error fetching all roadmaps:", error.message);
      }
    };
  
    fetchAllRoadmaps();
  }, [token]);  

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <AddRoadmapForm onAddItem={handleAddRoadmapItem} token={token} />

      <div className="space-y-2 mt-4">
        {roadmapItems.length === 0 ? (
          <div>No roadmap items yet.</div>
        ) : (
          roadmapItems.map((item) => (
            <div key={item.id} className="bg-white rounded shadow">
              <button
                className="w-full text-left px-4 py-3 flex justify-between items-center"
                onClick={() => toggleExpand(item.id)}
              >
                <span>{item.title}</span>
                <span>{expandedItems[item.id] ? "▾" : "▸"}</span>
              </button>

              {expandedItems[item.id] && (
                <div className="pl-8 pr-4 pb-4 space-y-2">
                  {item.children.map((child) => (
                    <div
                      key={child.id}
                      className="bg-gray-100 rounded px-3 py-2 flex justify-between items-center"
                    >
                      <span>{child.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoadMap;

