import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL;
const DetailPage = () => {
  const { roadmapId, childTitle } = useParams(); // Get roadmapId and childTitle from the URL
  const [roadmap, setRoadmap] = useState(null);
  const [milestoneDetail, setMilestoneDetail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Your real token (it can be retrieved from context or localStorage)
  const token = "YOUR_TOKEN_HERE"; // Replace with your real token or retrieve dynamically

  useEffect(() => {
    const fetchRoadmapDetail = async () => {
      setLoading(true);
      setError(null); // Reset error state before the request

      try {
        // Fetch the roadmap data using the roadmapId and token
        const response = await fetch(`${baseUrl}/api/users/roadmaps/${roadmapId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token in the Authorization header
          },
        });

        if (!response.ok) throw new Error("Failed to fetch roadmap details");

        const data = await response.json();
        const roadmapData = data.roadmap;

        // Find the specific milestone by title
        const matchedMilestone = roadmapData.milestone.find((m) => m === childTitle);

        if (matchedMilestone) {
          setRoadmap(roadmapData);
          setMilestoneDetail(matchedMilestone);
        } else {
          setMilestoneDetail(`No detail found for "${childTitle}"`);
        }
      } catch (error) {
        setError(error.message); // Set error message for display
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapDetail();
  }, [roadmapId, childTitle, token]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (!roadmap) return <div>No roadmap found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Detail for Milestone: "{childTitle}"</h2>

      {/* Show roadmap title */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Roadmap Title: {roadmap.title}</h3>
        <p className="text-sm text-gray-600">Created At: {new Date(roadmap.created_at).toLocaleString()}</p>
      </div>

      {/* Show milestone detail */}
      <div className="space-y-2">
        <p>{milestoneDetail}</p>
      </div>

      {/* Optionally, list all milestones */}
      <div className="mt-4">
        <h4 className="text-md font-semibold">All Milestones</h4>
        <ul className="list-disc pl-5">
          {roadmap.milestone.map((milestone, index) => (
            <li key={index}>{milestone}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetailPage;
