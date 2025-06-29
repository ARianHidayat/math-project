// LOKASI: src/pages/api/latihan/submit.js
// VERSI BARU: Dengan logika koreksi yang lebih canggih untuk menangani urutan angka dan teks.

import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

// FUNGSI PINTAR BARU: Untuk membersihkan dan menormalkan jawaban
function normalizeAndCompare(userAnswer, correctAnswer) {
    if (typeof userAnswer !== 'string' || typeof correctAnswer !== 'string' || !userAnswer) {
        return false;
    }

    // Fungsi untuk mengekstrak dan mengurutkan angka
    const extractAndSortNumbers = (text) => {
        const numbers = text.match(/-?\d+(\.\d+)?/g);
        if (!numbers) return null;
        return numbers.map(Number).sort((a, b) => a - b).toString();
    };

    const userNumbers = extractAndSortNumbers(userAnswer);
    const correctNumbers = extractAndSortNumbers(correctAnswer);

    // Prioritas 1: Bandingkan angka jika ada
    if (userNumbers && correctNumbers) {
        return userNumbers === correctNumbers;
    }

    // Prioritas 2: Jika tidak ada angka, bandingkan teks yang sudah dibersihkan
    const cleanUserAnswer = userAnswer.trim().toLowerCase().replace(/\s+/g, ' ');
    const cleanCorrectAnswer = correctAnswer.trim().toLowerCase().replace(/\s+/g, ' ');

    return cleanUserAnswer === cleanCorrectAnswer;
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { paketId, answers: userAnswers } = req.body;
    if (!paketId || !userAnswers) {
        return res.status(400).json({ error: "Data tidak lengkap." });
    }

    const questionsFromDb = await prisma.question.findMany({
        where: { paketSoalId: parseInt(paketId) }
    });
    
    let correctCount = 0;
    const answerDetails = [];

    for (const question of questionsFromDb) {
        const userAnswerText = userAnswers[question.id] || null;
        let isCorrect = false;

        // --- LOGIKA PENILAIAN BARU MENGGUNAKAN FUNGSI PINTAR ---
        if (userAnswerText) {
            // Jika soal Pilihan Ganda, tetap gunakan perbandingan sederhana
            if (question.optionA) { 
                if (question.correctAnswer.toUpperCase() === userAnswerText.toUpperCase()) {
                    isCorrect = true;
                }
            } else { // Jika soal Esai, gunakan fungsi perbandingan pintar kita
                isCorrect = normalizeAndCompare(userAnswerText, question.correctAnswer);
            }
        }
        
        if(isCorrect) {
            correctCount++;
        }
        // --- AKHIR DARI LOGIKA PENILAIAN BARU ---
        
        answerDetails.push({
            questionId: question.id,
            userAnswer: userAnswerText,
            isCorrect: isCorrect,
        });
    }

    const totalQuestions = questionsFromDb.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    const newQuizSession = await prisma.$transaction(async (tx) => {
        const quizSession = await tx.quizSession.create({
            data: {
                userId: session.user.id,
                score: score,
                totalQuestions: totalQuestions,
                correctCount: correctCount,
                incorrectCount: totalQuestions - correctCount,
                status: "completed",
                endTime: new Date(),
            }
        });

        const answersToCreate = answerDetails.map(detail => ({
            ...detail,
            quizSessionId: quizSession.id
        }));

        await tx.quizAnswer.createMany({
            data: answersToCreate
        });
        
        return quizSession;
    });

    return res.status(200).json({ sessionId: newQuizSession.id });

  } catch (error) {
    console.error("❌ Gagal memproses jawaban kuis:", error);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  } finally {
    await prisma.$disconnect();
  }
}
