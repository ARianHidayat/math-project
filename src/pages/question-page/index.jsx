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
  // 1. Ubah state untuk menampung banyak soal dalam bentuk array
  const [questions, setQuestions] = useState([]);
  // State untuk jumlah soal yang akan dibuat
  const [numQuestions, setNumQuestions] = useState(5); 
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
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div>Memeriksa status login...</div>
        </div>
    );
  }

  // Kalau belum login, jangan render halaman ini
  if (!session) {
    return null;
  }

  const generateQuestions = async () => {
    setLoading(true);
    setError("");
    setQuestions([]); // Kosongkan array soal sebelum request baru

    try {
      // 2. Kirim 'numberOfQuestions' ke API
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, numberOfQuestions: numQuestions }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghasilkan soal");
      }

      const data = await res.json();
      // 3. Simpan array soal ke dalam state
      setQuestions(data.questions); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="h3 font-bold mb-4 text-center">Buat Soal Matematika Otomatis</h1>
        
        <div className='input-group d-flex justify-content-center gap-2 mb-4'>
          {/* Input untuk Topik Soal */}
          <input
            type="text"
            placeholder="Masukkan topik (misal: Aljabar)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="form-control"
            style={{ maxWidth: '400px' }}
          />
          
          {/* 4. Dropdown untuk memilih jumlah soal */}
          <select 
            className="form-select" 
            style={{ maxWidth: '150px' }}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            disabled={loading}
          >
            <option value="1">1 Soal</option>
            <option value="5">5 Soal</option>
            <option value="10">10 Soal</option>
          </select>
          
          <div className="input-group-append">
            <button
              onClick={generateQuestions}
              disabled={loading || !topic}
              type='button'
              className="btn btn-success text-white"
            >
              {loading ? "Memproses..." : "Buat Soal"}
            </button>
          </div>
        </div>

        {error && <p className="alert alert-danger text-center">{error}</p>}

        {/* 5. Tampilkan hasil soal dengan melakukan mapping/looping */}
        {questions.length > 0 && (
          <div className="mt-4">
            {questions.map((item, index) => (
              <div key={index} className="card mb-3">
                <div className="card-header">
                  <h2 className="h5 font-semibold">Soal #{index + 1}</h2>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <ReactMarkdown>{item.question}</ReactMarkdown>
                  </div>
                  <hr />
                  <h3 className="h6 font-semibold mt-3">Jawaban:</h3>
                  <ReactMarkdown>{item.answer}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}