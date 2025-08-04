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
    const [numMultipleChoice, setNumMultipleChoice] = useState(3); // Default untuk PG
    const [numEssay, setNumEssay] = useState(2); // Default untuk Esai

    // --- TAMBAHKAN STATE DI BAWAH INI ---
    const [rppContext, setRppContext] = useState("");
    const [showRpp, setShowRpp] = useState(false);

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
    // --- PERUBAHAN 2: Sesuaikan Logika Pengiriman Data ---
    const handleGenerateDraft = async () => {
        setLoading(true);
        setError("");
        setPaketSoal(null);
        setIsDraftMode(false);

        const requestBody = {
            questionType: questionType,
            difficulty: difficulty,
            rppContext: rppContext, // <-- TAMBAHKAN BARIS INI
            ...(mode === 'single' ? { topic } : { topics })
        };

        if (questionType === 'mixed') {
            // Jika mode campuran, kirim jumlah spesifik PG dan Esai
            requestBody.numMultipleChoice = numMultipleChoice;
            requestBody.numEssay = numEssay;
        } else {
            // Jika tidak, kirim jumlah total seperti biasa
            requestBody.numberOfQuestions = numQuestions;
        }

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

    // --- FUNGSI YANG DIPERBAIKI ---
    const handleReplaceQuestion = async (indexToReplace) => {
        setIsReplacing(indexToReplace); // Tandai soal yang sedang diganti
        setError("");
        
        // Tentukan tipe soal yang akan diganti (PG atau Esai)
        const questionToReplace = paketSoal.questions[indexToReplace];
        // Soal dianggap PG jika punya optionA, jika tidak maka dianggap Esai.
        const typeToGenerate = questionToReplace.optionA ? 'multiple_choice' : 'essay';

        const requestBody = {
            difficulty: difficulty,
            rppContext: rppContext, // <-- TAMBAHKAN BARIS INI JUGA
            ...(mode === 'single' ? { topic } : { topics }),
            questionType: typeToGenerate, // Kirim tipe soal yang benar
            numberOfQuestions: 1, // Kita hanya butuh satu soal pengganti
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

                            {/* --- TAMBAHKAN BLOK KODE DI BAWAH INI --- */}


                            <label className="form-label fw-bold">2. Tentukan Pengaturan</label>
                            <div className='row g-2 mb-4'>
                                <div className="col-md">
                                    <select className="form-select form-select-lg" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={loading}>
                                        <optgroup label="Jenjang Pendidikan">
                                            <option value="sd">SD (Dasar)</option>
                                            <option value="smp">SMP (Menengah)</option>
                                        </optgroup>
                                        <optgroup label="Taksonomi Bloom (Kognitif)">
                                            <option value="bloom_c1">C1: Mengingat (Remembering)</option>
                                            <option value="bloom_c2">C2: Memahami (Understanding)</option>
                                            <option value="bloom_c3">C3: Menerapkan (Applying)</option>
                                            <option value="bloom_c4">C4: Menganalisis (Analyzing)</option>
                                            <option value="bloom_c5">C5: Mengevaluasi (Evaluating)</option>
                                            <option value="bloom_c6">C6: Mencipta (Creating)</option>
                                        </optgroup>
                                        <optgroup label="Kerangka Pembelajaran Lain">
                                            <option value="gagne_recall">Gagne: Mengingat Prasyarat</option>
                                            <option value="gagne_elicit">Gagne: Mendorong Kinerja</option>
                                            <option value="vak_visual">VAK: Tipe Visual (Berbasis Deskripsi)</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="col-md">
                                    <select className="form-select form-select-lg" value={questionType} onChange={(e) => setQuestionType(e.target.value)} disabled={loading}>
                                        <option value="multiple_choice">Tipe: Pilihan Ganda</option>
                                        <option value="essay">Tipe: Esai</option>
                                        {/* TAMBAHKAN BARIS DI BAWAH INI */}
                                        <option value="mixed">Tipe: Campuran (PG & Esai)</option>
                                    </select>
                                </div>
                                {/* --- BAGIAN YANG DIPERBARUI 3: Tampilan Input Jumlah Soal --- */}
                                {questionType === 'mixed' ? (
                                    <>
                                        <div className="col-md">
                                            <div className="input-group">
                                                <span className="input-group-text">PG</span>
                                                <input type="number" className="form-control form-control-lg" value={numMultipleChoice} onChange={(e) => setNumMultipleChoice(Number(e.target.value))} min="0" />
                                            </div>
                                        </div>
                                        <div className="col-md">
                                            <div className="input-group">
                                                <span className="input-group-text">Esai</span>
                                                <input type="number" className="form-control form-control-lg" value={numEssay} onChange={(e) => setNumEssay(Number(e.target.value))} min="0" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="col-md">
                                        <select className="form-select form-select-lg" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} disabled={loading}>
                                            <option value="1">1 Soal</option>
                                            <option value="3">3 Soal</option>
                                            <option value="5">5 Soal</option>
                                            <option value="10">10 Soal</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <div className="form-check mb-2">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="showRppCheck" 
                                        checked={showRpp} 
                                        onChange={(e) => setShowRpp(e.target.checked)} 
                                    />
                                    <label className="form-check-label fw-bold" htmlFor="showRppCheck">
                                        Sertakan Konteks dari RPP (Opsional)
                                    </label>
                                </div>
                                
                                {showRpp && (
                                    <textarea 
                                        id="rppContext"
                                        className="form-control" 
                                        rows="4" 
                                        placeholder="Salin dan tempel bagian dari RPP Anda di sini, contoh: 'Siswa mampu menyelesaikan soal perkalian dua digit...' agar soal yang dihasilkan lebih relevan."
                                        value={rppContext}
                                        onChange={(e) => setRppContext(e.target.value)}
                                    ></textarea>
                                )}
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
