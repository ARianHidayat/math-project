// LOKASI: src/pages/api/save-paket.js
// Untuk menyimpan draft menjadi paket soal permanen

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user || !session.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { topic, questions } = req.body;

        const savedPaket = await prisma.$transaction(async (tx) => {
            const newPaketSoal = await tx.paketSoal.create({
                data: { topic, userId: session.user.id },
            });
            const questionsToSave = questions.map(q => ({
                questionText: q.questionText,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
                // --- PERBAIKAN DI SINI ---
                // Jika q.correctAnswer tidak ada (misalnya pada soal esai),
                // berikan nilai default "N/A".
                correctAnswer: q.correctAnswer || "N/A",
                solution: q.isHot ? `[HOT] ${q.solution}` : q.solution,
                paketSoalId: newPaketSoal.id,
            }));
            await tx.question.createMany({ data: questionsToSave });
            return tx.paketSoal.findUnique({
                where: { id: newPaketSoal.id },
                include: { questions: true },
            });
        });
        
        return res.status(201).json(savedPaket);

    } catch (error) {
        console.error("❌ Gagal menyimpan paket soal:", error);
        return res.status(500).json({ error: "Gagal menyimpan paket soal." });
    } finally {
        await prisma.$disconnect();
    }
}
