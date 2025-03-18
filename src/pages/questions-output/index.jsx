import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("/api/questions"); // Panggil endpoint GET
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Gagal mengambil data soal:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Daftar Soal</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada soal yang dibuat.</p>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="p-4 border rounded-lg shadow-md bg-white">
              <p className="font-semibold">📝 Soal:</p>
              <ReactMarkdown>{q.question}</ReactMarkdown>

              <p className="font-semibold mt-3">✅ Jawaban:</p>
              <ReactMarkdown>{q.answer}</ReactMarkdown>

              <p className="text-sm text-gray-500 mt-3">
                📅 Dibuat pada: {new Date(q.created_at).toLocaleString()}
              </p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
