// LOKASI: src/pages/question-page/index.jsx
// VERSI BARU: Dengan tambahan teks petunjuk di atas daftar draf.

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { v4 as uuidv4 } from 'uuid';

import Navbar from '@/components/navbar';
import PaketSoalCard from '@/components/PaketSoalCard';
import TagInput from '@/components/TagInput';
import DraftQuestionCard from '@/components/DraftQuestionCard';

export default function GenerateQuestionPage() {
    const { data: session, status } = useSession();
    const [mode, setMode] = useState('single');
    const [topic, setTopic] = useState("");
    const [topics, setTopics] = useState([]);
    const [questionType, setQuestionType] = useState('multiple_choice');
    const [difficulty, setDifficulty] = useState('sd');
    const [numQuestions, setNumQuestions] = useState(5);
    const [numMultipleChoice, setNumMultipleChoice] = useState(3);
    const [numEssay, setNumEssay] = useState(2);
    const [rppContext, setRppContext] = useState("");
    const [showRpp, setShowRpp] = useState(false);
    const [hotQuestions, setHotQuestions] = useState(new Set());
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

    const handleGenerateDraft = async () => {
        setLoading(true);
        setError("");
        setPaketSoal(null);
        setIsDraftMode(false);
        const requestBody = {
            questionType, difficulty, rppContext,
            ...(mode === 'single' ? { topic } : { topics })
        };
        if (questionType === 'mixed') {
            requestBody.numMultipleChoice = numMultipleChoice;
            requestBody.numEssay = numEssay;
        } else {
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

    const handleReplaceQuestion = async (indexToReplace) => {
        setIsReplacing(indexToReplace);
        setError("");
        const questionToReplace = paketSoal.questions[indexToReplace];
        const typeToGenerate = questionToReplace.optionA ? 'multiple_choice' : 'essay';
        const requestBody = {
            difficulty, rppContext,
            ...(mode === 'single' ? { topic } : { topics }),
            questionType: typeToGenerate,
            numberOfQuestions: 1,
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

    const handleToggleHot = (tempId) => {
        setHotQuestions(prevHot => {
            const newHot = new Set(prevHot);
            if (newHot.has(tempId)) {
                newHot.delete(tempId);
            } else {
                newHot.add(tempId);
            }
            return newHot;
        });
    };

    const handleSavePaket = async () => {
        setIsSaving(true);
        setError("");
        const finalQuestions = paketSoal.questions
            .filter(q => !q.isDeleted)
            .map(q => ({ ...q, isHot: hotQuestions.has(q.tempId) }));
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
            setHotQuestions(new Set());
            alert("Paket soal berhasil disimpan!");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

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
                                    <button type="button" className={`btn ${mode === 'single' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('single')}>Topik Tunggal</button>
                                    <button type="button" className={`btn ${mode === 'multiple' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('multiple')}>Materi Bervariasi</button>
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
                            <div className="mb-4">
                                <div className="form-check mb-2">
                                    <input className="form-check-input" type="checkbox" id="showRppCheck" checked={showRpp} onChange={(e) => setShowRpp(e.target.checked)} />
                                    <label className="form-check-label fw-bold" htmlFor="showRppCheck">2. Sertakan Konteks dari RPP (Opsional)</label>
                                </div>
                                {showRpp && (
                                    <textarea id="rppContext" className="form-control" rows="4" placeholder="Salin dan tempel bagian dari RPP Anda di sini..." value={rppContext} onChange={(e) => setRppContext(e.target.value)}></textarea>
                                )}
                            </div>
                            <label className="form-label fw-bold">3. Tentukan Pengaturan</label>
                            <div className='row g-2 mb-4'>
                                <div className="col-md">
                                    <select className="form-select form-select-lg" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={loading}>
                                        <optgroup label="Jenjang Pendidikan"><option value="sd">SD (Dasar)</option><option value="smp">SMP (Menengah)</option></optgroup>
                                        <optgroup label="Taksonomi Bloom (Kognitif)"><option value="bloom_c1">C1: Mengingat</option><option value="bloom_c2">C2: Memahami</option><option value="bloom_c3">C3: Menerapkan</option><option value="bloom_c4">C4: Menganalisis</option><option value="bloom_c5">C5: Mengevaluasi</option><option value="bloom_c6">C6: Mencipta</option></optgroup>
                                        <optgroup label="Kerangka Lain"><option value="gagne_recall">Gagne: Mengingat Prasyarat</option><option value="gagne_elicit">Gagne: Mendorong Kinerja</option><option value="vak_visual">VAK: Tipe Visual</option></optgroup>
                                    </select>
                                </div>
                                <div className="col-md">
                                    <select className="form-select form-select-lg" value={questionType} onChange={(e) => setQuestionType(e.target.value)} disabled={loading}>
                                        <option value="multiple_choice">Tipe: Pilihan Ganda</option>
                                        <option value="essay">Tipe: Esai</option>
                                        <option value="mixed">Tipe: Campuran (PG & Esai)</option>
                                    </select>
                                </div>
                                {questionType === 'mixed' ? (
                                    <><div className="col-md"><div className="input-group"><span className="input-group-text">PG</span><input type="number" className="form-control form-control-lg" value={numMultipleChoice} onChange={(e) => setNumMultipleChoice(Number(e.target.value))} min="0" /></div></div><div className="col-md"><div className="input-group"><span className="input-group-text">Esai</span><input type="number" className="form-control form-control-lg" value={numEssay} onChange={(e) => setNumEssay(Number(e.target.value))} min="0" /></div></div></>
                                ) : (
                                    <div className="col-md"><select className="form-select form-select-lg" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} disabled={loading}><option value="1">1 Soal</option><option value="3">3 Soal</option><option value="5">5 Soal</option><option value="10">10 Soal</option></select></div>
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
                            {isDraftMode ? "Draft Paket Soal" : "Paket Soal Berhasil Disimpan"}
                        </h2>
                        {isDraftMode && (
                            <div className="alert alert-secondary small">
                                <strong>Petunjuk:</strong> Anda berada dalam mode draf. Di sini Anda bisa meninjau setiap soal.
                                Gunakan tombol 🔥 untuk menandai soal sebagai Soal HOT (skor lebih tinggi) dan tombol 🗑️ untuk menghapus soal.
                                Soal yang dihapus bisa dibuat ulang dengan menekan tombol 🔄 "Buat Soal Pengganti".
                            </div>
                        )}
                        {isDraftMode ? (
                            <div>
                                {paketSoal.questions.map((q, index) => (
                                    <DraftQuestionCard 
                                        key={q.tempId} 
                                        question={q} 
                                        index={index} 
                                        onDelete={handleDeleteQuestion} 
                                        onReplace={handleReplaceQuestion} 
                                        isReplacing={isReplacing === index}
                                        onToggleHot={handleToggleHot}
                                        isHot={hotQuestions.has(q.tempId)}
                                    />
                                ))}
                                <div className="d-flex justify-content-end mt-4 gap-2">
                                    <button className="btn btn-outline-danger" onClick={() => { setPaketSoal(null); setIsDraftMode(false); setHotQuestions(new Set()); }}>Buang Draft</button>
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