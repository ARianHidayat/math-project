// LOKASI: src/pages/latihan/[paketId].jsx
// VERSI BARU: Dengan logika peringatan sebelum submit & modal konfirmasi.

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import Navbar from '../../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';


// Komponen Modal Konfirmasi
const ConfirmationModal = ({ show, onHide, onConfirm, unansweredCount }) => {
    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Konfirmasi Pengumpulan</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        <p>Anda belum menjawab <strong>{unansweredCount} soal</strong>.</p>
                        <p>Apakah Anda yakin ingin mengumpulkan jawaban Anda sekarang?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onHide}>Batal</button>
                        <button type="button" className="btn btn-success" onClick={onConfirm}>
                            Yakin, Kumpulkan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Komponen utama halaman latihan
export default function LatihanPage({ paket }) {
    const router = useRouter(); 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State untuk modal

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    if (!paket) {
        return (
            <div>
                <Navbar />
                <div className="container text-center mt-5">
                    <h1 className="h3">Paket Soal Tidak Ditemukan</h1>
                    <p>Paket soal yang Anda cari tidak ada atau telah dihapus.</p>
                </div>
            </div>
        );
    }
    
    const { questions } = paket;
    const currentQuestion = questions[currentIndex];

    // --- PENGECEKAN APAKAH SOAL INI HOT ---
    const isHotQuestion = currentQuestion.solution?.startsWith('[HOT]');
    
    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    // Fungsi inti untuk mengirim data ke API
    const proceedToSubmit = async () => {
        setShowConfirmModal(false); // Tutup modal jika terbuka
        setIsSubmitting(true);
        setError('');
        try {
            const response = await fetch('/api/latihan/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paketId: paket.id,
                    answers: userAnswers,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Gagal mengirimkan jawaban.');
            }
            router.push(`/hasil/${result.sessionId}`);
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };
    
    // Fungsi handler utama saat tombol diklik
    const handleSubmit = () => {
        const answeredCount = Object.values(userAnswers).filter(Boolean).length;
        const totalQuestions = questions.length;

        if (answeredCount < totalQuestions) {
            // Jika ada soal yang belum dijawab, tampilkan modal konfirmasi
            setShowConfirmModal(true);
        } else {
            // Jika semua sudah dijawab, langsung proses
            proceedToSubmit();
        }
    };
    
    const goToQuestion = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4 mb-5">
                <div className="mb-4">
                    <Link href="/questions-output" className="btn btn-outline-secondary btn-sm">
                        &larr; Kembali ke Riwayat
                    </Link>
                </div>

                <div className="card shadow-sm">
                    <div className="card-header bg-light">
                        <div className="d-flex justify-content-between align-items-center">
                            <div><h1 className="h5 mb-0 fw-bold">Latihan: {paket.topic}</h1></div>
                            <div className="d-flex align-items-center">
                                {/* --- PENANDA SOAL HOT DITAMBAHKAN DI SINI --- */}
                                {isHotQuestion && (
                                    <span className="badge bg-warning text-dark me-2">🔥 Soal HOT</span>
                                )}
                                <div className="badge bg-primary rounded-pill fs-6">
                                    Soal {currentIndex + 1} dari {questions.length}
                                </div>
                            </div>                        
                        </div>
                    </div>
                    <div className="card-body p-4">
                        <div className="mb-4" style={{ fontSize: '1.1rem' }}>
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{currentQuestion.questionText}</ReactMarkdown>
                        </div>
                        <div className="answer-section">
                            {currentQuestion.optionA ? (
                                ['A', 'B', 'C', 'D'].map(optionKey => (
                                    currentQuestion[`option${optionKey}`] && <div key={optionKey} className="form-check mb-3">
                                        <input
                                            className="form-check-input" type="radio"
                                            name={`question-${currentQuestion.id}`}
                                            id={`option-${currentQuestion.id}-${optionKey}`}
                                            value={optionKey}
                                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                            checked={userAnswers[currentQuestion.id] === optionKey}
                                        />
                                        <label className="form-check-label" htmlFor={`option-${currentQuestion.id}-${optionKey}`}>
                                            {currentQuestion[`option${optionKey}`]}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <div>
                                    <label htmlFor={`answer-${currentQuestion.id}`} className="form-label">Jawaban Anda:</label>
                                    <textarea
                                        id={`answer-${currentQuestion.id}`} className="form-control"
                                        rows="4" value={userAnswers[currentQuestion.id] || ''}
                                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                    ></textarea>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="card-footer d-flex justify-content-between">
                        <button className="btn btn-secondary" onClick={handlePrev} disabled={currentIndex === 0 || isSubmitting}>Sebelumnya</button>
                        {currentIndex === questions.length - 1 ? (
                            <button className="btn btn-success" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Memproses...' : 'Kumpulkan Jawaban'}</button>
                        ) : (
                            <button className="btn btn-primary" onClick={handleNext} disabled={isSubmitting}>Berikutnya</button>
                        )}
                    </div>
                </div>

                <div className="card shadow-sm mt-4">
                    <div className="card-header"><span className="fw-bold">Navigasi Soal</span></div>
                    <div className="card-body">
                        <div className="d-flex flex-wrap gap-2">
                            {questions.map((question, index) => (
                                <button 
                                    key={question.id}
                                    onClick={() => goToQuestion(index)}
                                    className={`btn btn-sm ${userAnswers[question.id] ? 'btn-primary' : 'btn-outline-primary'}`}
                                    style={{ fontWeight: currentIndex === index ? 'bold' : 'normal', minWidth: '40px' }}
                                    disabled={isSubmitting}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>

            {/* Render Komponen Modal Konfirmasi */}
            <ConfirmationModal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                onConfirm={proceedToSubmit}
                unansweredCount={questions.length - Object.values(userAnswers).filter(Boolean).length}
            />
        </div>
    );
}

// Fungsi getServerSideProps untuk mengambil data paket soal dari server
export async function getServerSideProps(context) {
  const prisma = new PrismaClient();
  const { paketId } = context.params;

  try {
    const paket = await prisma.paketSoal.findUnique({
      where: { id: parseInt(paketId) },
      include: { questions: true },
    });
    
    const serializablePaket = JSON.parse(JSON.stringify(paket));

    return {
      props: { paket: serializablePaket },
    };
  } catch (error) {
    console.error("Gagal mengambil data paket soal untuk latihan:", error);
    return {
      props: { paket: null },
    };
  } finally {
    await prisma.$disconnect();
  }
}
