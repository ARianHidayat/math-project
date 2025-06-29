// LOKASI: src/pages/question-page/index.jsx
// VERSI FINAL: Menggabungkan semua logika Anda dengan perbaikan redirect.

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react"; // Pastikan signIn diimpor
import { v4 as uuidv4 } from 'uuid';

// Impor semua komponen Anda
import Navbar from '@/pages/components/navbar';
import PaketSoalCard from '@/pages/components/PaketSoalCard';
import TagInput from '@/pages/components/TagInput';
import DraftQuestionCard from '@/pages/components/DraftQuestionCard';

export default function GenerateQuestionPage() {
    const { data: session, status } = useSession();

    // --- State untuk Form Input ---
    const [mode, setMode] = useState('single');
    const [topic, setTopic] = useState("");
    const [topics, setTopics] = useState([]);
    const [questionType, setQuestionType] = useState('essay');
    const [numQuestions, setNumQuestions] = useState(5);

    // --- State untuk Proses & Hasil ---
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isReplacing, setIsReplacing] = useState(false);
    const [error, setError] = useState("");
    const [paketSoal, setPaketSoal] = useState(null);
    const [isDraftMode, setIsDraftMode] = useState(false); 

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
        
        // LOGIKA PERBAIKAN: Jika status sudah selesai dicek dan pengguna tidak login,
        // panggil fungsi signIn() dari NextAuth untuk redirect yang benar.
        if (status !== "loading" && status === "unauthenticated") {
            signIn();
        }
    }, [status]);

    // Tampilkan pesan loading saat sesi sedang diperiksa
    if (status === "loading") {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div>Memeriksa status login...</div>
            </div>
        );
    }
    
    // Jika tidak diautentikasi, jangan render apa pun, biarkan proses redirect berjalan.
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
            setError("Tidak ada soal untuk disimpan. Mohon buat soal pengganti atau buang draft.");
            setIsSaving(false);
            return;
        }

        try {
            const res = await fetch("/api/save-paket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: displayTopic, questions: finalQuestions }),
                credentials: 'include', // Jangan lupa tambahkan ini juga
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

    // --- TAMPILAN JSX LENGKAP ANDA ---
    return (
        <div className='mx-auto'>
            <Navbar />
            <div className="container mt-5">
                <h1 className="h3 fw-bold mb-4 text-center">Buat Soal Matematika Otomatis</h1>
                
                {!isDraftMode && (
                    <>
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
                        
                        <div className='row g-2 justify-content-center align-items-center mb-4'>
                            <div className="col-lg">
                                {mode === 'single' ? (
                                    <input type="text" placeholder="Masukkan topik (misal: Aljabar)" value={topic} onChange={(e) => setTopic(e.target.value)} className="form-control shadow-sm"/>
                                ) : (
                                    <TagInput onTopicsChange={setTopics} />
                                )}
                            </div>
                            <div className="col-lg-auto">
                                <select className="form-select shadow-sm" value={questionType} onChange={(e) => setQuestionType(e.target.value)} disabled={loading}>
                                    <option value="essay">Tipe Soal: Esai</option>
                                    <option value="multiple_choice">Tipe Soal: Pilihan Ganda</option>
                                </select>
                            </div>
                            <div className="col-lg-auto">
                                <select className="form-select shadow-sm" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} disabled={loading}>
                                    <option value="1">1 Soal</option>
                                    <option value="3">3 Soal</option>
                                    <option value="5">5 Soal</option>
                                    <option value="10">10 Soal</option>
                                </select>
                            </div>
                            <div className="col-lg-auto">
                                <button onClick={handleGenerateDraft} disabled={loading || (mode === 'single' ? !topic : topics.length === 0)} type='button' className="btn btn-success text-white shadow-sm">
                                    {loading ? "Memproses..." : "Buat Draft"}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {loading && <div className="text-center">Membuat soal, mohon tunggu...</div>}
                {error && <p className="alert alert-danger text-center">{error}</p>}

                {paketSoal && (
                    <div className="mt-4">
                        <h2 className="h4 text-center mb-3">
                            {isDraftMode ? "Draft Paket Soal (Bisa Dihapus/Diganti)" : "Paket Soal Berhasil Disimpan"}
                        </h2>

                        {isDraftMode ? (
                            <div>
                                {paketSoal.questions.map((q, index) => (
                                    <DraftQuestionCard
                                        key={q.tempId}
                                        question={q}
                                        index={index}
                                        onDelete={handleDeleteQuestion}
                                        onReplace={handleReplaceQuestion}
                                        isReplacing={isReplacing && paketSoal.questions[index].isDeleted}
                                    />
                                ))}
                                <div className="d-flex justify-content-end mt-4 gap-2">
                                    <button className="btn btn-outline-danger" onClick={() => { setPaketSoal(null); setIsDraftMode(false); }}>
                                        Buang Draft
                                    </button>
                                    <button className="btn btn-primary" onClick={handleSavePaket} disabled={isSaving}>
                                        {isSaving ? "Menyimpan..." : "✅ Simpan Paket Soal Ini"}
                                    </button>
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
