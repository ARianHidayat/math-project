// LOKASI: src/pages/api/latihan/submit.js
// VERSI BARU: Dengan logika koreksi pintar untuk soal esai.

import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

// FUNGSI BARU: Untuk membersihkan dan mengekstrak angka dari teks
function normalizeAnswer(text) {
    if (typeof text !== 'string' || !text) return "";
    
    // Ganti koma desimal (gaya Indonesia) dengan titik desimal
    let cleanText = text.replace(/,/g, '.');
    
    // Ambil semua angka, tanda minus di depan, dan titik desimal.
    // Ini akan mengubah "Jawaban: -25.5 cm" menjadi "-25.5"
    const matches = cleanText.match(/-?\d+(\.\d+)?/g);
    
    // Jika tidak ada angka yang ditemukan, kembalikan teks asli yang sudah dibersihkan dari spasi
    if (!matches) {
        return text.trim().toLowerCase();
    }
    
    // Gabungkan semua angka yang ditemukan (jika ada lebih dari satu)
    return matches.join('');
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
        const userAnswer = userAnswers[question.id] || null;
        let isCorrect = false;

        // --- LOGIKA PENILAIAN BARU ---
        if (userAnswer) {
            // Jika soal PG, bandingkan seperti biasa (case-insensitive)
            if (question.optionA) {
                if (question.correctAnswer.toUpperCase() === userAnswer.toUpperCase()) {
                    isCorrect = true;
                }
            } else { // Jika soal esai, gunakan koreksi pintar
                const normalizedUserAnswer = normalizeAnswer(userAnswer);
                const normalizedCorrectAnswer = normalizeAnswer(question.correctAnswer);
                
                if (normalizedUserAnswer && normalizedCorrectAnswer && normalizedUserAnswer === normalizedCorrectAnswer) {
                    isCorrect = true;
                }
            }
        }
        
        if(isCorrect) {
            correctCount++;
        }
        // --- AKHIR LOGIKA PENILAIAN BARU ---
        
        answerDetails.push({
            questionId: question.id,
            userAnswer: userAnswer,
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
