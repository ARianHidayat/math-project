// LOKASI: src/pages/api/generate-only.js
// VERSI FINAL: Menggabungkan logika prompt detail dengan konteks jenjang.

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" },
});

// Fungsi untuk mendapatkan instruksi tambahan berdasarkan jenjang
const getDifficultyContext = (difficulty) => {
    switch (difficulty) {
        case 'sd':
            return 'Soal harus sangat sederhana, cocok untuk anak Sekolah Dasar. Gunakan operasi dasar seperti penjumlahan, pengurangan, dan perkalian satu atau dua digit. Hindari angka negatif, pecahan, atau soal cerita yang rumit.';
        case 'smp':
            return 'Soal harus memiliki tingkat kesulitan menengah, cocok untuk siswa SMP. Boleh menyertakan aljabar dasar, geometri sederhana, angka negatif, dan pecahan. Soal cerita diperbolehkan.';
        case 'sma':
            return 'Soal harus tingkat lanjut, cocok untuk siswa SMA/SMK. Boleh mencakup topik kompleks seperti kalkulus, trigonometri, statistika, atau aljabar lanjutan. Soal harus menantang dan membutuhkan pemikiran kritis.';
        default:
            return ''; // Tidak ada konteks tambahan jika tidak spesifik
    }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Mengambil semua data dari body, TERMASUK 'difficulty' yang baru
    const { topic, topics, numberOfQuestions, questionType, difficulty } = req.body;
    const count = numberOfQuestions || 5;

    if (!topic && (!Array.isArray(topics) || topics.length === 0)) {
        return res.status(400).json({ error: "Topik tidak boleh kosong" });
    }

    // Ambil instruksi kontekstual berdasarkan difficulty
    const contextualInstruction = getDifficultyContext(difficulty);
    
    let prompt;
    let mainInstruction;
    const isMultiTopic = topics && topics.length > 0;

    // === MENGEMBALIKAN LOGIKA mainInstruction YANG DETAIL ===
    if (isMultiTopic) {
        mainInstruction = `Buat total ${count} soal matematika tentang topik-topik berikut: ${topics.join(', ')}.`;
    } else {
        mainInstruction = `Buat ${count} soal matematika tentang topik "${topic}".`;
    }
    // === AKHIR DARI LOGIKA mainInstruction YANG BENAR ===

    let formatInstruction;
    if (questionType === 'multiple_choice') {
        formatInstruction = `Jenis soal harus Pilihan Ganda. Format respons dalam array JSON yang valid, setiap objek berisi: "questionText", "optionA", "optionB", "optionC", "optionD", "correctAnswer" (HANYA HURUF), dan "solution". Pastikan setiap soal memiliki 4 pilihan.`;
    } else { // Esai
        formatInstruction = `Jenis soal harus Esai. Format respons dalam array JSON yang valid dengan properti "questionText", "correctAnswer", dan "solution".`;
    }

    // Gabungkan semua instruksi menjadi satu prompt yang kuat dan spesifik
    prompt = `${mainInstruction}
    ${formatInstruction}
    PENTING: ${contextualInstruction}
    `;
    
    console.log("Mengirim prompt cerdas ke AI:", prompt);
    const result = await model.generateContent(prompt);
    const questionsData = JSON.parse(result.response.text());

    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      console.error("AI returned invalid data format:", result.response.text());
      return res.status(500).json({ error: "Format respons dari AI tidak valid." });
    }
    
    console.log(`✅ Gemini berhasil membuat ${questionsData.length} soal draft.`);
    return res.status(200).json(questionsData);

  } catch (error) {
    console.error("❌ Terjadi kesalahan di API generate-only:", error);
    const errorMessage = error.message || "Gagal generate soal.";
    return res.status(500).json({ error: errorMessage });
  }
}
