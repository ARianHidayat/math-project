// LOKASI: src/pages/hasil/[sessionId].jsx
// VERSI FINAL: Dengan kartu skor yang lebih menarik, pesan kontekstual, dan kode yang lengkap.

import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import Navbar from '../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// --- FUNGSI PINTAR UNTUK PESAN KONTEKSTUAL ---
const getFeedbackMessage = (score) => {
    if (score === 100) {
        return {
            title: "SEMPURNA! 🤩",
            message: "Jenius! Semua jawaban benar. Kamu adalah master sejati di topik ini!",
            icon: "🏆",
            gradient: "linear-gradient(135deg, #ffc107, #ff9800)"
        };
    } else if (score >= 80) {
        return {
            title: "KEREN BANGET! ✨",
            message: "Hampir sempurna! Sedikit lagi menuju puncak. Terus asah kemampuanmu!",
            icon: "🚀",
            gradient: "linear-gradient(135deg, #0d6efd, #0747a6)"
        };
    } else if (score >= 60) {
        return {
            title: "KERJA BAGUS! 😁",
            message: "Sudah di atas rata-rata! Review lagi jawaban yang salah, kamu pasti bisa lebih baik lagi.",
            icon: "💪",
            gradient: "linear-gradient(135deg, #198754, #146c43)"
        };
    } else if (score >= 40) {
        return {
            title: "JANGAN MENYERAH! 🔥",
            message: "Setiap kesalahan adalah pelajaran berharga. Jalan masih panjang, semangat terus!",
            icon: "🧗",
            gradient: "linear-gradient(135deg, #6c757d, #495057)"
        };
    } else {
        return {
            title: "AWAL YANG BAIK! 🌱",
            message: "Jangan kecil hati. Dari sini kita mulai menanam. Gagal itu bumbu, coba lagi nanti lebih seru!",
            icon: "💡",
            gradient: "linear-gradient(135deg, #dc3545, #b02a37)"
        };
    }
};

// Komponen untuk menampilkan satu item hasil jawaban
const ResultItem = ({ answerDetail, index }) => {
    const { question, userAnswer, isCorrect } = answerDetail;
    const isMultipleChoice = question.optionA !== null;

    const getCorrectAnswerText = () => {
        if (!isMultipleChoice) return question.correctAnswer;
        const key = question.correctAnswer.toUpperCase();
        if (key === 'A') return question.optionA;
        if (key === 'B') return question.optionB;
        if (key === 'C') return question.optionC;
        if (key === 'D') return question.optionD;
        return "Jawaban tidak valid";
    };

    return (
        <div className={`card mb-3 shadow-sm ${isCorrect ? 'border-success' : 'border-danger'}`}>
            <div className="card-header d-flex justify-content-between align-items-center">
                <span className="fw-bold">Soal #{index + 1}</span>
                {isCorrect ? (
                    <span className="badge bg-success">Benar ✔</span>
                ) : (
                    <span className="badge bg-danger">Salah ❌</span>
                )}
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{question.questionText}</ReactMarkdown>
                </div>
                <hr />
                <p className="mb-1"><strong>Jawaban Anda:</strong></p>
                <div className={`p-2 rounded mb-2 ${isCorrect ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                    {userAnswer || <span className="text-muted fst-italic">Tidak dijawab</span>}
                </div>
                {!isCorrect && (
                    <>
                        <p className="mb-1"><strong>Jawaban yang Benar:</strong></p>
                        <div className="p-2 rounded mb-3 bg-success-subtle">
                           {getCorrectAnswerText()}
                        </div>
                    </>
                )}
                <p className="mb-1"><strong>Pembahasan:</strong></p>
                <div className="p-2 rounded bg-info-subtle">
                     <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{question.solution || "Tidak ada pembahasan."}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};


// Komponen utama Halaman Hasil
export default function HasilPage({ quizResult }) {
    if (!quizResult) {
        return (
            <div>
                <Navbar />
                <div className="container text-center mt-5">
                    <h1 className="h3">Hasil Tidak Ditemukan</h1>
                    <p>Sesi kuis yang Anda cari tidak ada atau telah dihapus.</p>
                </div>
            </div>
        );
    }
    
    // Dapatkan pesan dan style berdasarkan skor
    const feedback = getFeedbackMessage(quizResult.score);
    const paketId = quizResult.QuizAnswers[0]?.question.paketSoalId;

    return (
        <div className='bg-light' style={{ minHeight: '100vh' }}>
            <Navbar />
            <div className="container py-5">
                {/* === KARTU SKOR BARU YANG LEBIH MENARIK === */}
                <div 
                    className="text-center p-5 mb-5 rounded-3 shadow text-white"
                    style={{ background: feedback.gradient }}
                >
                    <div className="display-1 mb-3">{feedback.icon}</div>
                    <h1 className="h2 fw-bold">{feedback.title}</h1>
                    <p className="lead">{feedback.message}</p>
                    <hr className='my-4 border-white-50' />
                    <h3 className="h5 text-white-75 mb-0">Skor Akhir Anda</h3>
                    <p className="display-2 fw-bolder">{quizResult.score}</p>
                    <p className="h6 fw-normal">
                        (Menjawab <strong>{quizResult.correctCount}</strong> dari <strong>{quizResult.totalQuestions}</strong> soal dengan benar)
                    </p>
                </div>
                {/* === AKHIR DARI KARTU SKOR BARU === */}


                {/* Bagian Rincian Jawaban */}
                <h2 className="h3 text-center mb-4 text-dark">Rincian Jawaban</h2>
                {quizResult.QuizAnswers.map((answer, index) => (
                    <ResultItem key={answer.id} answerDetail={answer} index={index} />
                ))}
                
                {/* Tombol Aksi */}
                <div className="text-center my-5 d-flex justify-content-center gap-3">
                    {/* Tombol "Ulangi Latihan" hanya muncul jika kita berhasil mendapatkan paketId */}
                    {paketId && (
                        <Link href={`/latihan/${paketId}`} className="btn btn-outline-primary btn-lg">
                            Ulangi Latihan
                        </Link>
                    )}
                    <Link href="/questions-output" className="btn btn-primary btn-lg">
                        Selesai & Kembali ke Riwayat
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Fungsi ini berjalan di server untuk mengambil data hasil kuis sebelum halaman ditampilkan
export async function getServerSideProps(context) {
  const prisma = new PrismaClient();
  const { sessionId } = context.params;

  try {
    const quizResult = await prisma.quizSession.findUnique({
      where: { 
        id: parseInt(sessionId)
      },
      include: {
        QuizAnswers: { // Ambil semua detail jawaban dari sesi ini
          orderBy: { questionId: 'asc' },
          include: {
            question: true // Untuk setiap jawaban, ambil juga data soal aslinya
          }
        }
      }
    });

    const serializableResult = JSON.parse(JSON.stringify(quizResult));

    return {
      props: {
        quizResult: serializableResult,
      },
    };
  } catch (error) {
    console.error("Gagal mengambil data hasil kuis:", error);
    return {
      props: {
        quizResult: null,
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}