// LOKASI: src/pages/hasil/[sessionId].jsx
// Halaman ini menampilkan hasil akhir dari sesi kuis yang telah dikerjakan.

import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import Navbar from '../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

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
    
    // Hitung persentase skor
    const scorePercentage = quizResult.score;

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                {/* Bagian Skor Utama */}
                <div className="text-center p-5 mb-5 bg-light rounded-3 shadow">
                    <h1 className="h4 text-muted">Skor Akhir Anda</h1>
                    <p className="display-1 fw-bolder text-primary">{scorePercentage}</p>
                    <p className="h5 fw-normal">
                        Anda berhasil menjawab <strong>{quizResult.correctCount}</strong> dari <strong>{quizResult.totalQuestions}</strong> soal dengan benar.
                    </p>
                </div>

                {/* Bagian Rincian Jawaban */}
                <h2 className="h3 text-center mb-4">Rincian Jawaban</h2>
                {quizResult.QuizAnswers.map((answer, index) => (
                    <ResultItem key={answer.id} answerDetail={answer} index={index} />
                ))}
                
                {/* Tombol Aksi */}
                <div className="text-center my-5">
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
