// LOKASI: src/pages/question-page/index.jsx
// VERSI FINAL: Menggabungkan semua logika Anda dengan penambahan fitur Jenjang dan tampilan yang diperbarui.

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { v4 as uuidv4 } from 'uuid';

// Impor semua komponen Anda
import Navbar from '@/components/navbar';
import PaketSoalCard from '@/components/PaketSoalCard';
import TagInput from '@/components/TagInput';
import DraftQuestionCard from '@/components/DraftQuestionCard';

export default function GenerateQuestionPage() {
    const { data: session, status } = useSession();

    // --- State untuk Form Input ---
    const [mode, setMode] = useState('single');
    const [topic, setTopic] = useState("");
    const [topics, setTopics] = useState([]);
    const [questionType, setQuestionType] = useState('multiple_choice');
    const [numQuestions, setNumQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('sd'); // <-- STATE BARU UNTUK JENJANG

    // --- State untuk Proses & Hasil ---
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isReplacing, setIsReplacing] = useState(false);
    const [error, setError] = useState("");
    const [paketSoal, setPaketSoal] = useState(null);
    const [isDraftMode, setIsDraftMode] = useState(false); 

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
        if (status !== "loading" && status === "unauthenticated") {
            signIn();
        }
    }, [status]);

    if (status === "loading") {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div>Memeriksa status login...</div>
            </div>
        );
    }
    
    if (status === "unauthenticated") {
        return null;
    }

    // --- KUMPULAN FUNGSI LENGKAP ANDA ---

    const handleGenerateDraft = async () => {
        setLoading(true);
        setError("");
        setPaketSoal(null);
        setIsDraftMode(false);

        const requestBody = {
            numberOfQuestions: numQuestions,
            questionType: questionType,
            difficulty: difficulty, // <-- Menambahkan data jenjang ke request
            ...(mode === 'single' ? { topic } : { topics })
        };

        try {
            const res = await fetch("/api/generate-only", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody), 
                credentials: 'include',
            });
            if (!res.ok) throw new Error((await res.json()).error || "Gagal generate soal");

            const data = await res.json();
            const questionsWithId = data.map(q => ({ ...q, tempId: uuidv4(), isDeleted: false }));
            setPaketSoal({ questions: questionsWithId });
            setIsDraftMode(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = (tempId) => {
        setPaketSoal(prevPaket => {
            const newQuestions = prevPaket.questions.map(q => 
                q.tempId === tempId ? { ...q, isDeleted: true } : q
            );
            return { ...prevPaket, questions: newQuestions };
        });
    };

    const handleReplaceQuestion = async (indexToReplace) => {
        setIsReplacing(true);
        setError("");
        
        const requestBody = {
            numberOfQuestions: 1,
            questionType: questionType,
            difficulty: difficulty, // <-- Menambahkan data jenjang juga di sini
            ...(mode === 'single' ? { topic } : { topics })
        };

        try {
            const res = await fetch("/api/generate-only", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody), 
                credentials: 'include',
            });
            if (!res.ok) throw new Error((await res.json()).error || "Gagal generate soal pengganti");

            const [newQuestion] = await res.json();
            setPaketSoal(prevPaket => {
                const updatedQuestions = [...prevPaket.questions];
                updatedQuestions[indexToReplace] = { ...newQuestion, tempId: uuidv4(), isDeleted: false };
                return { ...prevPaket, questions: updatedQuestions };
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsReplacing(false);
        }
    };

    const handleSavePaket = async () => {
        setIsSaving(true);
        setError("");

        const finalQuestions = paketSoal.questions.filter(q => !q.isDeleted);
        const displayTopic = mode === 'single' ? topic : topics.join(', ');

        if(finalQuestions.length === 0) {
            setError("Tidak ada soal untuk disimpan.");
            setIsSaving(false);
            return;
        }

        try {
            const res = await fetch("/api/save-paket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: displayTopic, questions: finalQuestions }),
                credentials: 'include',
            });
            if (!res.ok) throw new Error((await res.json()).error || "Gagal menyimpan paket soal");

            const savedPaket = await res.json();
            setPaketSoal(savedPaket);
            setIsDraftMode(false);
            alert("Paket soal berhasil disimpan!");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // --- TAMPILAN JSX YANG SUDAH DIPERBARUI & DIPERINDAH ---
    return (
        <div className='mx-auto bg-light' style={{ minHeight: '100vh' }}>
            <Navbar />
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="display-6 fw-bold">Buat Soal Matematika Otomatis</h1>
                    <p className="lead text-muted">Atur kebutuhan soal Anda dan biarkan AI kami yang bekerja.</p>
                </div>
                
                {!isDraftMode && (
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-4 p-md-5">
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
                            
                            <div className="mb-4">
                                <label className="form-label fw-bold">1. Masukkan Topik Soal</label>
                                {mode === 'single' ? (
                                    <input type="text" placeholder="Contoh: Perkalian Dasar" value={topic} onChange={(e) => setTopic(e.target.value)} className="form-control form-control-lg"/>
                                ) : (
                                    <TagInput onTopicsChange={setTopics} />
                                )}
                            </div>

                            <label className="form-label fw-bold">2. Tentukan Pengaturan</label>
                            <div className='row g-2 mb-4'>
                                <div className="col-md">
                                    <select className="form-select form-select-lg" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={loading}>
                                        <option value="sd">Jenjang: SD (Sederhana)</option>
                                        <option value="smp">Jenjang: SMP (Menengah)</option>
                                        <option value="sma">Jenjang: SMA/SMK (Lanjutan)</option>
                                    </select>
                                </div>
                                <div className="col-md">
                                    <select className="form-select form-select-lg" value={questionType} onChange={(e) => setQuestionType(e.target.value)} disabled={loading}>
                                        <option value="multiple_choice">Tipe: Pilihan Ganda</option>
                                        <option value="essay">Tipe: Esai</option>
                                    </select>
                                </div>
                                <div className="col-md">
                                    <select className="form-select form-select-lg" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} disabled={loading}>
                                        <option value="1">1 Soal</option>
                                        <option value="3">3 Soal</option>
                                        <option value="5">5 Soal</option>
                                        <option value="10">10 Soal</option>
                                    </select>
                                </div>
                            </div>

                            <div className="d-grid">
                                <button onClick={handleGenerateDraft} disabled={loading || (mode === 'single' ? !topic : topics.length === 0)} type='button' className="btn btn-success btn-lg text-white shadow-sm fw-bold">
                                    {loading ? "Memproses..." : "🚀 Buat Draft Soal"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {loading && <div className="text-center">Membuat soal, mohon tunggu...</div>}
                {error && <p className="alert alert-danger text-center mt-4">{error}</p>}

                {paketSoal && (
                    <div className="mt-4">
                        <h2 className="h4 text-center mb-3">
                            {isDraftMode ? "Draft Paket Soal (Bisa Dihapus/Diganti)" : "Paket Soal Berhasil Disimpan"}
                        </h2>
                        {isDraftMode ? (
                            <div>
                                {paketSoal.questions.map((q, index) => (
                                    <DraftQuestionCard key={q.tempId} question={q} index={index} onDelete={handleDeleteQuestion} onReplace={handleReplaceQuestion} isReplacing={isReplacing && paketSoal.questions[index].isDeleted} />
                                ))}
                                <div className="d-flex justify-content-end mt-4 gap-2">
                                    <button className="btn btn-outline-danger" onClick={() => { setPaketSoal(null); setIsDraftMode(false); }}>Buang Draft</button>
                                    <button className="btn btn-primary fw-bold" onClick={handleSavePaket} disabled={isSaving}>{isSaving ? "Menyimpan..." : "✅ Simpan Paket Soal Ini"}</button>
                                </div>
                            </div>
                        ) : (
                            <PaketSoalCard paket={paketSoal} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
