"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Navbar from '@/pages/components/navbar';
// 1. Impor komponen baru yang akan kita gunakan
import PaketSoalCard from '@/pages/components/PaketSoalCard'; 

export default function GenerateQuestionPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [topic, setTopic] = useState("");
  // 2. Ubah state untuk menampung satu objek "paket soal" yang baru dibuat
  const [generatedPaket, setGeneratedPaket] = useState(null); 
  const [numQuestions, setNumQuestions] = useState(5); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect dan import bootstrap tetap sama
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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

  const generateQuestions = async () => {
    setLoading(true);
    setError("");
    setGeneratedPaket(null); // Kosongkan paket soal yang lama

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
      // 3. Simpan seluruh objek paket soal yang diterima dari API
      setGeneratedPaket(data); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto'>
      <Navbar />
      <div className="container mt-5">
        <h1 className="h3 font-bold mb-4 text-center">Buat Soal Matematika Otomatis</h1>
        
        {/* Bagian Form Input tidak berubah */}
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
            <option value="3">3 Soal</option>
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

        {/* 4. Tampilan hasil sekarang JAUH LEBIH SEDERHANA */}
        {generatedPaket && (
          <div className="mt-4">
            <h2 className="h4 text-center mb-3">Hasil Soal</h2>
            {/* Cukup panggil komponen PaketSoalCard dan berikan datanya */}
            <PaketSoalCard paket={generatedPaket} />
          </div>
        )}
      </div>
    </div>
  );
}