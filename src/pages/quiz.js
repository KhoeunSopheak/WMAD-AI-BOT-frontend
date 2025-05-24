import React, { useState, useEffect } from "react";
import { Navigation2, LoaderPinwheel } from "lucide-react";

const GenerateQuiz = () => {
  const [topic, setTopic] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // new

  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchAllQuizzes = async () => {
      if (!token || !user_id) return;
      try {
        const res = await fetch(`http://localhost:3003/api/users/quizzes/generate/${user_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized or fetch failed");

        const data = await res.json();
        setQuizzes(data.quiz);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      }
    };

    fetchAllQuizzes();
  }, [token, user_id]);

  const handleGenerateQuiz = async () => {
    if (!topic || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3003/api/users/quizzes/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic }),
      });

      const text = await response.text();
      const match = text.match(/\[\s*{[\s\S]*?}\s*\]/);

      if (!match) throw new Error("Quiz array not found in response.");

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

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleAnswerClick = (quizIndex, option) => {
    if (selectedAnswers[quizIndex]) return; // Already answered

    const isCorrect = quizzes[quizIndex].correct_answer === option;
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizIndex]: {
        selected: option,
        correct: isCorrect,
        correctAnswer: quizzes[quizIndex].correct_answer, // This is needed for display
      },
    }));    
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">AI Quiz Generator</h2>

      {/* Input */}
      <div className="flex gap-4 mb-6 sticky top-0 z-30 p-4 shadow-sm">
        <input
          type="text"
          className="border p-2 w-full rounded-md h-14"
          placeholder="Enter topic (e.g., HTML)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          onClick={handleGenerateQuiz}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center w-14 h-14"
        >
          {loading ? <LoaderPinwheel className="animate-spin" /> : <Navigation2 />}
        </button>
      </div>

      {/* Messages */}
      {!token && <p className="text-red-500 text-center mb-4">Please log in to generate quizzes.</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Quizzes */}
      {quizzes.length === 0 ? (
        <p className="text-center text-gray-600 mt-8">No quiz items yet. Try generating one!</p>
      ) : (
        quizzes.slice(0, visibleCount).map((quiz, index) => {
          const answer = selectedAnswers[index];
          return (
            <div key={index} className="border p-4 rounded-md shadow mb-4">
              <h3 className="font-semibold mb-2">Topic: {quiz.topic}</h3>
              <p className="font-semibold mb-2">
                <span className="text-blue-600">Question:</span> {quiz.question}
              </p>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {quiz.options.map((opt, i) => {
                  const isSelected = answer?.selected === opt;

                  let bg = "bg-white";
                  if (isSelected) {
                    bg = answer.correct
                      ? "bg-green-200 text-green-800 border-green-400 font-semibold"
                      : "bg-red-200 text-red-800 border-red-400 font-semibold";
                  }

                  return (
                    <button
                      key={i}
                      className={`border rounded-md p-3 text-left ${bg}`}
                      onClick={() => handleAnswerClick(index, opt)}
                      disabled={!!answer}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answer && (
                <p className={`mt-2 font-semibold ${answer.correct ? "text-green-600" : "text-red-600"}`}>
                  {answer.correct ? "Correct!" : "Incorrect"}
                </p>
              )}

              {answer && !answer.correct && (
                <p className="mt-1 text-sm text-blue-700">
                  The correct answer is: <span className="font-semibold">{answer.correctAnswer}</span>
                </p>
              )}

            </div>
          );
        })
      )}

      {/* See More */}
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
