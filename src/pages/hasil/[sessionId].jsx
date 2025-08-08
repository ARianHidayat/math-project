// LOKASI: src/pages/hasil/[sessionId].jsx
// VERSI FINAL: Memperbaiki logika perhitungan skor agar 100% akurat.

import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import Navbar from '../../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const getFeedbackMessage = (score) => {
    if (score === 100) return { title: "SEMPURNA! 🤩", message: "Jenius! Semua jawaban benar. Kamu adalah master sejati di topik ini!", icon: "🏆", gradient: "linear-gradient(135deg, #ffc107, #ff9800)" };
    if (score >= 80) return { title: "KEREN BANGET! ✨", message: "Hampir sempurna! Sedikit lagi menuju puncak. Terus asah kemampuanmu!", icon: "🚀", gradient: "linear-gradient(135deg, #0d6efd, #0747a6)" };
    if (score >= 60) return { title: "KERJA BAGUS! 😁", message: "Sudah di atas rata-rata! Review lagi jawaban yang salah, kamu pasti bisa lebih baik lagi.", icon: "💪", gradient: "linear-gradient(135deg, #198754, #146c43)" };
    if (score >= 40) return { title: "JANGAN MENYERAH! 🔥", message: "Setiap kesalahan adalah pelajaran berharga. Jalan masih panjang, semangat terus!", icon: "🧗", gradient: "linear-gradient(135deg, #6c757d, #495057)" };
    return { title: "AWAL YANG BAIK! 🌱", message: "Jangan kecil hati. Dari sini kita mulai menanam. Gagal itu bumbu, coba lagi nanti lebih seru!", icon: "💡", gradient: "linear-gradient(135deg, #dc3545, #b02a37)" };
};

// --- FUNGSI PERHITUNGAN SKOR FIX ---
const calculateWeightedScore = (quizAnswers) => {
    const totalQuestions = quizAnswers.length;
    if (totalQuestions === 0) {
        return { score: 0, correctCount: 0, totalQuestions: 0, scoreDetails: [] };
    }

    // Tandai soal HOT
    const answersWithDetails = quizAnswers.map(ans => ({
        ...ans,
        isHot: ans.question.solution?.startsWith('[HOT]')
    }));

    const hotWeight = 1.5; // Bobot soal HOT
    const totalWeight = answersWithDetails.reduce((sum, ans) => {
        return sum + (ans.isHot ? hotWeight : 1);
    }, 0);

    // Nilai per soal berdasarkan bobot
    const getBasePoints = (isHot) => (isHot ? (hotWeight / totalWeight) * 100 : (1 / totalWeight) * 100);

    let finalScore = 0;
    let correctCount = 0;

    const scoreDetails = answersWithDetails.map(ans => {
        const basePoints = getBasePoints(ans.isHot);
        let gainedPoints = 0;

        if (ans.isCorrect) {
            gainedPoints = basePoints;
            correctCount++;
        } else if (ans.userAnswer) {
            // Penalti 25% dari poin soal itu
            gainedPoints = -(basePoints * 0.25);
        }

        finalScore += gainedPoints;

        return { ...ans, points: basePoints }; // Simpan poin asli tanpa dibulatkan
    });

    // Kalau semua benar, langsung set ke 100
    if (correctCount === totalQuestions) {
        finalScore = 100;
    } else {
        finalScore = Math.max(0, finalScore);
    }

    return {
        score: Math.round(finalScore), // Bulatkan hanya skor akhir
        correctCount,
        totalQuestions,
        scoreDetails
    };
};


const ResultItem = ({ answerDetail, index }) => {
    const { question, userAnswer, isCorrect, points } = answerDetail;
    const isMultipleChoice = question.optionA !== null;
    
    const isHot = question.solution?.startsWith('[HOT]');
    const cleanSolution = isHot ? question.solution.replace('[HOT] ', '') : question.solution;

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
                <span className="fw-bold">
                    Soal #{index + 1}
                    {isHot && <span className="badge bg-warning text-dark ms-2">🔥 Soal HOT</span>}
                </span>
                <div>
                    {/* {isCorrect ? (
                        <span className="badge bg-light text-success me-2">+{points.toFixed(2)} Poin</span>
                        ) : (
                        <span className="badge bg-light text-danger me-2">-{(points * 0.25).toFixed(2)} Poin</span>
                    )} */}
                    {isCorrect ? <span className="badge bg-success">Benar ✔</span> : <span className="badge bg-danger">Salah ❌</span>}
                </div>
            </div>
            <div className="card-body">
                <div className="mb-3"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{question.questionText}</ReactMarkdown></div>
                <hr />
                <p className="mb-1"><strong>Jawaban Anda:</strong></p>
                <div className={`p-2 rounded mb-2 ${isCorrect ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>{userAnswer || <span className="text-muted fst-italic">Tidak dijawab</span>}</div>
                {!isCorrect && (<><p className="mb-1"><strong>Jawaban yang Benar:</strong></p><div className="p-2 rounded mb-3 bg-success-subtle">{getCorrectAnswerText()}</div></>)}
                <p className="mb-1"><strong>Pembahasan:</strong></p>
                <div className="p-2 rounded bg-info-subtle"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{cleanSolution || "Tidak ada pembahasan."}</ReactMarkdown></div>
            </div>
        </div>
    );
};

export default function HasilPage({ quizResult }) {
    if (!quizResult) {
        return (
            <div>
                <Navbar />
                <div className="container text-center mt-5"><h1 className="h3">Hasil Tidak Ditemukan</h1><p>Sesi kuis yang Anda cari tidak ada atau telah dihapus.</p></div>
            </div>
        );
    }
    
    const { score, correctCount, totalQuestions, scoreDetails } = calculateWeightedScore(quizResult.QuizAnswers);
    const feedback = getFeedbackMessage(score);
    const paketId = quizResult.QuizAnswers[0]?.question.paketSoalId;

    return (
        <div className='bg-light' style={{ minHeight: '100vh' }}>
            <Navbar />
            <div className="container py-5">
                <div className="text-center p-5 mb-5 rounded-3 shadow text-white" style={{ background: feedback.gradient }}>
                    <div className="display-1 mb-3">{feedback.icon}</div>
                    <h1 className="h2 fw-bold">{feedback.title}</h1>
                    <p className="lead">{feedback.message}</p>
                    <hr className='my-4 border-white-50' />
                    <h3 className="h5 text-white-75 mb-0">Skor Akhir Anda</h3>
                    <p className="display-2 fw-bolder">{score}</p>
                    <p className="h6 fw-normal">(Menjawab <strong>{correctCount}</strong> dari <strong>{totalQuestions}</strong> soal dengan benar)</p>
                </div>

                <h2 className="h3 text-center mb-4 text-dark">Rincian Jawaban</h2>
                {scoreDetails.map((answer, index) => (
                    <ResultItem 
                        key={answer.id} 
                        answerDetail={answer}
                        index={index} 
                    />
                ))}
                
                <div className="text-center my-5 d-flex justify-content-center gap-3">
                    {paketId && (<Link href={`/latihan/${paketId}`} className="btn btn-outline-primary btn-lg">Ulangi Latihan</Link>)}
                    <Link href="/questions-output" className="btn btn-primary btn-lg">Selesai & Kembali ke Riwayat</Link>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const prisma = new PrismaClient();
    const { sessionId } = context.params;
    try {
        const quizResult = await prisma.quizSession.findUnique({
            where: { id: parseInt(sessionId) },
            include: { QuizAnswers: { orderBy: { questionId: 'asc' }, include: { question: true } } }
        });
        if (!quizResult) {
            return { props: { quizResult: null } };
        }
        const serializableResult = JSON.parse(JSON.stringify(quizResult));
        return { props: { quizResult: serializableResult } };
    } catch (error) {
        console.error("Gagal mengambil data hasil kuis:", error);
        return { props: { quizResult: null } };
    } finally {
        await prisma.$disconnect();
    }
}