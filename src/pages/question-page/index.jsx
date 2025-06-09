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
  const [questions, setQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState(5); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect untuk redirect dan import bootstrap sudah benar
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');

    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Logika loading dan session check sudah benar
  if (status === "loading") {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div>Memeriksa status login...</div>
        </div>
    );
  }
  if (!session) {
    return null;
  }

  // Fungsi generateQuestions sudah benar
  const generateQuestions = async () => {
    setLoading(true);
    setError("");
    setQuestions([]); 

    try {
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
        
        {/* Bagian Input Form sudah benar */}
        <div className='input-group d-flex justify-content-center gap-2 mb-4'>
            <input
                type="text"
                placeholder="Masukkan topik (misal: Aljabar)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="form-control"
                style={{ maxWidth: '400px' }}
            />
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

        {/* ==== PERBAIKAN TAMPILAN HASIL ADA DI SINI ==== */}
        {questions.length > 0 && (
          <div className="mt-4">
            <h2 className="h4 text-center mb-3">Hasil Soal</h2>
            {questions.map((item, index) => (
              <div key={index} className="card mb-3 shadow-sm">
                <div className="card-header">
                  <h3 className="h6 mb-0">Soal #{index + 1}</h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <p className="font-semibold">📝 Pertanyaan:</p>
                    <div className="p-3 bg-light rounded">
                        <ReactMarkdown>{item.question}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Tombol dan Div untuk menampilkan/menyembunyikan solusi */}
                  <button 
                    className="btn btn-outline-secondary btn-sm" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target={`#solution-generated-${index}`}
                    aria-expanded="false"
                  >
                    Tampilkan/Sembunyikan Penyelesaian
                  </button>

                  <div className="collapse mt-2" id={`solution-generated-${index}`}>
                    <div className="p-3 bg-secondary-subtle rounded">
                        <p className="font-semibold">Langkah Penyelesaian:</p>
                        <ReactMarkdown>{item.solution}</ReactMarkdown>
                    </div>
                  </div>

                  <hr className="my-3"/>

                  <p className="font-semibold">✅ Jawaban Akhir:</p>
                  <div className="p-3 bg-light rounded">
                    <ReactMarkdown>{item.answer}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}