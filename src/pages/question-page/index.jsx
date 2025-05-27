"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Navbar from '@/pages/components/navbar';

export default function GenerateQuestionPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect ke login jika belum login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Tampilkan loading sementara cek session
  if (status === "loading") {
    return <div>Memeriksa status login...</div>;
  }

  // Kalau belum login, kita sudah redirect, jadi jangan render halaman ini
  if (!session) {
    return null;
  }

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
    <div className="p-6 max-w-lg mx-auto container-fluid">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4 text-center">Buat Soal Matematika</h1>
      <button
        className='btn btn-info'
        onClick={() => router.push('/questions-output')}
      >
        hasil soal
      </button>
      <div>
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
          className="btn btn-success text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Memproses..." : "Generate Soal"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {question && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="font-semibold">Soal:</h2>
          <ReactMarkdown>{question}</ReactMarkdown>
          <h2 className="font-semibold mt-2">Jawaban:</h2>
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
