import React, { useState, useEffect } from "react";
import { Navigation2, LoaderPinwheel } from "lucide-react";

const baseUrl = process.env.REACT_APP_BASE_URL;
const RoadMap = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
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
        `${baseUrl}/api/users/roadmaps/generate-roadmap`,
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

  const user_id = localStorage.getItem("user_id");
  // Load all existing roadmaps
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAllRoadmaps = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/users/roadmaps/generate/${user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch Roadmap");

        const data = await response.json();

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
  }, [user_id]);

  const handleDelete = async (id) => {
    setLoading(true);
  
    try {
      const res = await fetch(`${baseUrl}/api/users/roadmaps/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error("Failed to delete");
      setRoadmapItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting roadmap:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="h-screen w-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">AI Power Roadmap Generator</h2>
      {/* Form to add roadmap */}
      <form
        onSubmit={handleSubmit}
        className="p-4 flex gap-2 rounded sticky top-0 z-30"
      >
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a learning title..."
          className="flex-grow border p-2 rounded h-14"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-blue-700"
          disabled={loading}
        >
          {loading ? <LoaderPinwheel className="animate-spin text-white" />: <Navigation2 />}
        </button>
      </form>

      {/* List of roadmaps */}
      <div className="space-y-3 mt-4">
        {roadmapItems.length === 0 ? (
          <div className="text-center text-gray-600 mt-8">
          <p className="text-lg font-semibold">No roadmap items yet.</p>
          <p className="text-sm mt-2">Interested in testing your knowledge?</p>
          <p className="text-sm">Try generating a roadmap by entering a topic above!</p>
        </div>
        
        ) : (
          roadmapItems.slice(0, visibleCount).map((item) => (
            <div key={item.id} className="bg-white rounded shadow">
              <button
                className="w-full text-left px-4 py-3 flex justify-between items-center"
                onClick={() => toggleExpand(item.id)}
              >
                <span className="font-semibold"><span className="text-blue-600">Title:</span> {item.title}</span>
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
                  <div  className="w-full flex justify-end">
                    <button 
                    onClick={() => handleDelete(item.id)}
                    className="px-8 py-2 rounded bg-red-500 text-white"
                    >Delete</button>
                    </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {visibleCount < roadmapItems.length && (
        <div className="text-center mt-6">
          <button
            onClick={handleSeeMore}
            className="border border-blue-600 text-black px-6 py-2 rounded-md shadow hover:text-white hover:bg-blue-800"
          >
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default RoadMap;
