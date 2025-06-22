"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Navbar from '@/pages/components/navbar';
import PaketSoalCard from '@/pages/components/PaketSoalCard';
// BARU: Impor komponen TagInput yang sudah kita buat
import TagInput from '@/pages/components/TagInput'; 

export default function GenerateQuestionPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // --- STATE MANAGEMENT ---
  // BARU: State untuk mengontrol mode input: 'single' atau 'multiple'
  const [mode, setMode] = useState('single'); 
  
  // State untuk mode 'single' (seperti sebelumnya)
  const [topic, setTopic] = useState("");
  // BARU: State untuk mode 'multiple', akan diisi oleh komponen TagInput
  const [topics, setTopics] = useState([]); 

  // State lainnya tetap sama
  const [generatedPaket, setGeneratedPaket] = useState(null); 
  const [numQuestions, setNumQuestions] = useState(5); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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

  // MODIFIKASI: Fungsi ini sekarang lebih pintar
  const generateQuestions = async () => {
    setLoading(true);
    setError("");
    setGeneratedPaket(null);

    // MODIFIKASI: Siapkan body request berdasarkan mode yang aktif
    let requestBody;
    if (mode === 'single') {
      requestBody = { topic, numberOfQuestions: numQuestions };
    } else {
      // Untuk mode multiple, kita kirim array 'topics'
      requestBody = { topics, numberOfQuestions: numQuestions };
    }

    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // MODIFIKASI: Gunakan requestBody yang sudah disiapkan
        body: JSON.stringify(requestBody), 
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghasilkan soal");
      }

      const data = await res.json();
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
        <h1 className="h3 font-weight-bold mb-4 text-center">Buat Soal Matematika Otomatis</h1>
        
        {/* Tombol untuk memilih mode tetap sama */}
        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group" role="group">
            <button 
              type="button" 
              className={`btn ${mode === 'single' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setMode('single')}
            >
              Topik Tunggal
            </button>
            <button 
              type="button" 
              className={`btn ${mode === 'multiple' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setMode('multiple')}
            >
              Materi Bervariasi
            </button>
          </div>
        </div>
        
        {/* --- MODIFIKASI UTAMA DI SINI --- */}
        {/* Ganti 'input-group' dengan flexbox manual untuk kontrol penuh */}
        <div className='d-flex justify-content-center align-items-center gap-2 mb-4'>

          {/* 1. Wrapper untuk bagian input agar bisa dinamis */}
          <div style={{ flex: '1 1 auto', maxWidth: '450px' }}>
            {mode === 'single' ? (
              <input
                type="text"
                placeholder="Masukkan topik (misal: Aljabar)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="form-control shadow-sm" // form-control sudah punya tinggi yang pas
              />
            ) : (
              // TagInput sekarang menjadi anak langsung dari wrapper flex
              <TagInput onTopicsChange={setTopics} />
            )}
          </div>

          {/* 2. Wrapper untuk select, tidak banyak berubah */}
          <div style={{ flex: '0 0 auto' }}>
            <select 
              className="form-select shadow-sm" 
              style={{ width: '150px' }} // Atur lebar di sini
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              disabled={loading}
            >
              <option value="1">1 Soal</option>
              <option value="3">3 Soal</option>
              <option value="5">5 Soal</option>
              <option value="10">10 Soal</option>
            </select>
          </div>

          {/* 3. Wrapper untuk tombol, hilangkan 'input-group-append' */}
          <div style={{ flex: '0 0 auto' }} className='shadow-sm'>
            <button
              onClick={generateQuestions}
              disabled={loading || (mode === 'single' ? !topic : topics.length === 0)}
              type='button'
              className="btn btn-success text-white shadow-sm"
            >
              {loading ? "Memproses..." : "Buat Soal"}
            </button>
          </div>
        </div>

        {error && <p className="alert alert-danger text-center">{error}</p>}

        {generatedPaket && (
          <div className="mt-4">
            <h2 className="h4 text-center mb-3">Hasil Soal</h2>
            <PaketSoalCard paket={generatedPaket} />
          </div>
        )}
      </div>
    </div>
  );
}