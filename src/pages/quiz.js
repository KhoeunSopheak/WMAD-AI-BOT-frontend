import React, { useState, useEffect } from "react";

const GenerateQuiz = () => {
  const [topic, setTopic] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // To manage error messages
  console.log(topic);

  //const token = localStorage.getItem("token");
  //console.log(token);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY0NzI4NzQ3LWI4YmEtNDFmNi1iZjcwLWYwOWNhYzE3M2NhMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3MDMzMTQyLCJleHAiOjE3NDk2MjUxNDJ9.YnQehi_kECrixNTHAkQYAUKcDfNwhe4m5c_yE46IK78";

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

      // Try extracting the JSON-like array from the text using regex
      const match = text.match(/\[\s*{[\s\S]*?}\s*\]/); // Very basic array match

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

  const fetchAllQuizzes = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3003/api/users/quizzes", {
        headers,
      });

      if (!res.ok) throw new Error("Unauthorized or fetch failed");
      const data = await res.json();
      console.log(data);

      setQuizzes(data);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">AI Quiz Generator</h2>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          className="border p-2 w-full rounded-md"
          placeholder="Enter topic (e.g., HTML)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          onClick={handleGenerateQuiz}
          className={`bg-blue-600 text-white px-4 py-2 rounded-md ${
            loading ? "opacity-50" : ""
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
        <p className="text-red-500 mb-4 text-center">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {quizzes.map((quiz, index) => (
          <div key={index} className="border p-4 rounded-md shadow">
            <h3 className="font-semibold mb-2">Topic: {quiz.topic}</h3>
            <p className="mb-2">Q: {quiz.question}</p>
            <ul className="list-disc pl-5">
              {quiz.options.map((opt, i) => (
                <li
                  key={i}
                  className={
                    opt === quiz.correct_answer
                      ? "font-bold text-green-600"
                      : ""
                  }
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerateQuiz;
