"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function GenerateQuestionPage() {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuestion = async () => {
    setLoading(true);
    setError("");
    setQuestion("");
    setAnswer("");

    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) {
        throw new Error("Gagal menghasilkan soal");
      }

      const data = await res.json();
      setQuestion(data.question);
      setAnswer(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buat Soal Matematika</h1>
      <input
        type="text"
        placeholder="Masukkan topik (misal: Aljabar)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={generateQuestion}
        disabled={loading || !topic}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Memproses..." : "Generate Soal"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {question && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="font-semibold">Soal:</h2>
          <p>{question}</p>
          <h2 className="font-semibold mt-2">Jawaban:</h2>
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
