// LOKASI: src/pages/api/generate-only.js
// VERSI FINAL: Mendukung jumlah soal campuran yang spesifik.

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});

// Fungsi ini tidak perlu diubah sama sekali
const getDifficultyContext = (difficulty) => {
    switch (difficulty) {
        case 'sd':
            return 'Soal harus sangat sederhana, cocok untuk anak Sekolah Dasar. Gunakan operasi dasar seperti penjumlahan, pengurangan, dan perkalian satu atau dua digit. Hindari angka negatif, pecahan, atau soal cerita yang rumit.';
        case 'smp':
            return 'Soal harus memiliki tingkat kesulitan menengah, cocok untuk siswa SMP. Boleh menyertakan aljabar dasar, geometri sederhana, angka negatif, dan pecahan. Soal cerita diperbolehkan.';
        case 'sma':
            return 'Soal harus tingkat lanjut, cocok untuk siswa SMA/SMK. Boleh mencakup topik kompleks seperti kalkulus, trigonometri, statistika, atau aljabar lanjutan. Soal harus menantang dan membutuhkan pemikiran kritis.';
        default:
            return '';
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user || !session.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // --- BAGIAN YANG DIPERBARUI 1: Ambil parameter baru dari body ---
        const { topic, topics, questionType, difficulty, numberOfQuestions, numMultipleChoice, numEssay } = req.body;

        if (!topic && (!Array.isArray(topics) || topics.length === 0)) {
            return res.status(400).json({ error: "Topik tidak boleh kosong" });
        }

        const contextualInstruction = getDifficultyContext(difficulty);
        const isMultiTopic = topics && topics.length > 0;
        const topicString = isMultiTopic ? `topik-topik berikut: ${topics.join(', ')}` : `topik "${topic}"`;
        
        let mainInstruction;
        let formatInstruction;

        // --- BAGIAN YANG DIPERBARUI 2: Logika Prompt yang Lebih Cerdas ---
        if (questionType === 'mixed') {
            const pgCount = numMultipleChoice || 0;
            const essayCount = numEssay || 0;
            const total = pgCount + essayCount;

            if (total === 0) {
                return res.status(400).json({ error: "Jumlah total soal tidak boleh nol." });
            }

            mainInstruction = `Buat total ${total} soal matematika campuran dengan rincian: ${pgCount} soal Pilihan Ganda dan ${essayCount} soal Esai tentang ${topicString}.`;
            formatInstruction = `Format respons dalam array JSON yang valid. Untuk soal Pilihan Ganda, objek harus berisi: "questionText", "optionA", "optionB", "optionC", "optionD", "correctAnswer", dan "solution". Untuk soal Esai, objek harus berisi: "questionText", "correctAnswer", dan "solution".`;
        } else {
            // Logika untuk tipe soal non-campuran (kode Anda yang lama, tidak berubah)
            const count = numberOfQuestions || 5;
            mainInstruction = `Buat ${count} soal matematika tentang ${topicString}.`;

            if (questionType === 'multiple_choice') {
                formatInstruction = `Jenis soal harus Pilihan Ganda. Format respons dalam array JSON yang valid, setiap objek berisi: "questionText", "optionA", "optionB", "optionC", "optionD", "correctAnswer" (HANYA HURUF), dan "solution". Pastikan setiap soal memiliki 4 pilihan.`;
            } else { // essay
                formatInstruction = `Jenis soal harus Esai. Format respons dalam array JSON yang valid dengan properti "questionText", "correctAnswer", dan "solution".`;
            }
        }

        const prompt = `${mainInstruction}\n${formatInstruction}\nPENTING: ${contextualInstruction}`;
        
        console.log("Mengirim prompt ke AI:", prompt);
        const result = await model.generateContent(prompt);
        const questionsData = JSON.parse(result.response.text());

        if (!Array.isArray(questionsData)) {
            throw new Error("Format respons dari AI tidak valid.");
        }
        
        return res.status(200).json(questionsData);

    } catch (error) {
        console.error("❌ Terjadi kesalahan di API generate-only:", error);
        const errorMessage = error.message || "Gagal generate soal.";
        return res.status(500).json({ error: errorMessage });
    }
}