"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Navbar from '@/pages/components/navbar';
import PaketSoalCard from '@/pages/components/PaketSoalCard';
import TagInput from '@/pages/components/TagInput'; 

export default function GenerateQuestionPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    // --- STATE MANAGEMENT ---
    const [mode, setMode] = useState('single'); 
    const [topic, setTopic] = useState("");
    const [topics, setTopics] = useState([]); 
    
    // BARU: State untuk tipe soal
    const [questionType, setQuestionType] = useState('essay'); // 'essay' atau 'multiple_choice'

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

    const generateQuestions = async () => {
        setLoading(true);
        setError("");
        setGeneratedPaket(null);

        let requestBody;
        
        // MODIFIKASI: Siapkan body request yang sekarang menyertakan questionType
        const baseBody = {
            numberOfQuestions: numQuestions,
            questionType: questionType // <-- Kirim tipe soal ke API
        };

        if (mode === 'single') {
            requestBody = { ...baseBody, topic };
        } else {
            requestBody = { ...baseBody, topics };
        }

        try {
            const res = await fetch("/api/generate-question", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                <h1 className="h3 fw-bold mb-4 text-center">Buat Soal Matematika Otomatis</h1>
                
                {/* Tombol pilih mode topik (tidak ada perubahan) */}
                <div className="d-flex justify-content-center mb-4">
                    <div className="btn-group" role="group">
                        <button type="button" className={`btn ${mode === 'single' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('single')}>
                            Topik Tunggal
                        </button>
                        <button type="button" className={`btn ${mode === 'multiple' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('multiple')}>
                            Materi Bervariasi
                        </button>
                    </div>
                </div>
                
                {/* --- KUNCI PERBAIKAN FINAL MENGGUNAKAN GRID SYSTEM --- */}
                {/* 'row' adalah kontainer grid. 'g-2' adalah gap. 'justify-content-center' agar baris ini terpusat. */}
                <div className='row g-2 justify-content-center align-items-center mb-4'>

                    {/* 1. Kolom untuk Input Topik */}
                    {/* 'col-lg' berarti di layar besar, kolom ini akan mengisi sisa ruang. Di mobile, otomatis 100% */}
                    <div className="col-lg">
                        {mode === 'single' ? (
                            <input
                                type="text"
                                placeholder="Masukkan topik (misal: Aljabar)"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="form-control shadow-sm"
                            />
                        ) : (
                            <TagInput onTopicsChange={setTopics} />
                        )}
                    </div>

                    {/* 2. Kolom untuk Dropdown Tipe Soal */}
                    {/* 'col-lg-auto' berarti di layar besar, lebar kolom ini akan mengikuti isinya. Di mobile, otomatis 100% */}
                    <div className="col-lg-auto">
                        <select 
                            className="form-select shadow-sm"
                            value={questionType}
                            onChange={(e) => setQuestionType(e.target.value)}
                            disabled={loading}
                        >
                            <option value="essay">Tipe Soal: Esai</option>
                            <option value="multiple_choice">Tipe Soal: Pilihan Ganda</option>
                        </select>
                    </div>

                    {/* 3. Kolom untuk Dropdown Jumlah Soal */}
                    <div className="col-lg-auto">
                        <select 
                            className="form-select shadow-sm" 
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

                    {/* 4. Kolom untuk Tombol Buat Soal */}
                    <div className="col-lg-auto">
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

                {/* Sisa kode tidak berubah */}
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