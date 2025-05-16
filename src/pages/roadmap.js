import React, { useState, useEffect } from "react";

const RoadMap = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const token = localStorage.getItem("token");

  // Toggle open/close roadmap item
  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Add new roadmap to the list
  const handleAddRoadmapItem = (newItem) => {
    setRoadmapItems((prev) => [...prev, newItem]);
  };

  // Handle form submission to generate roadmap
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3003/api/users/roadmaps/generate-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: topic }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate roadmap");

      const data = await response.json();
      const roadmap = data.roadmap;

      handleAddRoadmapItem({
        id: roadmap.id,
        title: roadmap.title,
        children: roadmap.milestone.map((milestone, index) => ({
          id: `${roadmap.id}-${index}`,
          title: milestone.title,
          detail: milestone.detail,
          extraDetail: milestone.extraDetail || "",
        })),
      });

      setTopic("");
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load all existing roadmaps
  useEffect(() => {
    if (!token) return;

    const fetchAllRoadmaps = async () => {
      try {
        const response = await fetch(
          "http://localhost:3003/api/users/roadmaps",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        console.log("Roadmaps data:", data);

        if (data.roadmaps && Array.isArray(data.roadmaps)) {
          const allRoadmaps = data.roadmaps.map((r) => ({
            id: r.id,
            title: r.title || `Roadmap ${r.id.substring(0, 6)}`,
            children: Array.isArray(r.milestone)
              ? r.milestone.map((m, idx) => ({
                  id: `${r.id}-${idx}`,
                  title: m.title,
                  detail: m.detail,
                  extraDetail: "",
                }))
              : [],
          }));

          console.log("Mapped roadmaps:", allRoadmaps);
          setRoadmapItems(allRoadmaps);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchAllRoadmaps();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Form to add roadmap */}
      <form
        onSubmit={handleSubmit}
        className="p-4 flex gap-2 bg-white rounded shadow"
      >
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

      {/* List of roadmaps */}
      <div className="space-y-2 mt-4">
        {roadmapItems.length === 0 ? (
          <div className="text-center text-gray-600">No roadmap items yet.</div>
        ) : (
          roadmapItems.map((item) => (
            <div key={item.id} className="bg-white rounded shadow">
              <button
                className="w-full text-left px-4 py-3 flex justify-between items-center"
                onClick={() => toggleExpand(item.id)}
              >
                <span className="font-semibold">{item.title}</span>
                <span>{expandedItems[item.id] ? "▾" : "▸"}</span>
              </button>

              {expandedItems[item.id] && (
                <div className="pl-8 pr-4 pb-4 space-y-2">
                  {item.children.map((child) => (
                    <div
                      key={child.id}
                      className="bg-gray-100 rounded px-3 py-2"
                    >
                      <div className="font-semibold">{child.title}</div>
                      <div className="text-sm text-gray-700">
                        {child.detail}
                      </div>
                      {child.extraDetail && (
                        <div className="text-xs text-gray-500 italic">
                          {child.extraDetail}
                        </div>
                      )}
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
