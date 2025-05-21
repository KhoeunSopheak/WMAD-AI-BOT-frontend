import React, { useState, useEffect } from "react";

const GenerateQuiz = () => {
  const [topic, setTopic] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleGenerateQuiz = async () => {
    if (!topic || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3003/api/users/quizzes/generate-quiz", {
        method: "POST",
        headers,
        body: JSON.stringify({ topic }),
      });

      const text = await response.text();
      const match = text.match(/\[\s*{[\s\S]*?}\s*\]/);

      if (!match) {
        throw new Error("Quiz array not found in response.");
      }

      const parsedQuizzes = JSON.parse(match[0]);
      setQuizzes((prev) => [...parsedQuizzes, ...prev]);
      setTopic("");
    } catch (error) {
      console.error("Quiz load failed:", error);
      setError("Failed to extract quiz data.");
    } finally {
      setLoading(false);
    }
  };

  const user_id = localStorage.getItem("user_id");
  useEffect(() => {

  const fetchAllQuizzes = async () => {
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3003/api/users/generate/${user_id}`, {
        method: "GET",
        headers,
      });

      if (!res.ok) throw new Error("Unauthorized or fetch failed");

      const data = await res.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };

    fetchAllQuizzes();
  }, [user_id, token, headers]);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">AI Quiz Generator</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          className="border p-2 w-full rounded-md h-14"
          placeholder="Enter topic (e.g., HTML)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          onClick={handleGenerateQuiz}
          className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 ${loading ? "opacity-50" : ""
            }`}
          disabled={loading || !topic || !token}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {!token && (
        <p className="text-red-500 mb-4 text-center">
          Please log in to generate quizzes.
        </p>
      )}

      {error && (
        <p className="text-red-500 mb-4 text-center">{error}</p>
      )}

      <div className="space-y-4">
      {quizzes.length === 0 ? (
          <div className="text-center text-gray-600 mt-8">
          <p className="text-lg font-semibold">No quiz items yet.</p>
          <p className="text-sm mt-2">Interested in testing your knowledge?</p>
          <p className="text-sm">Try generating a quiz by entering a topic above!</p>
        </div>
        
        ) : (
        quizzes.slice(0, visibleCount).map((quiz, index) => (
          <div key={index} className="border p-4 rounded-md shadow">
            <h3 className="font-semibold mb-2">Topic: {quiz.topic}</h3>
            <p className="mb-2 font-semibold"><span className="text-blue-600">Question: </span>{quiz.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 mt-2">
              {quiz.options.map((opt, i) => (
                <div
                  key={i}
                  className={`p-3 border rounded-md ${opt === quiz.correct_answer
                      ? "bg-green-100 text-green-700 font-semibold border-green-500"
                      : "bg-white"
                    }`}
                >
                  {opt}
                </div>
              ))}
            </div>

          </div>
        ))
      )}
      </div>

      {visibleCount < quizzes.length && (
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

export default GenerateQuiz;
