// LOKASI: src/pages/api/generate-only.js
// VERSI FINAL: Menggunakan Pages Router dengan logika prompt yang lengkap.

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Mengambil data dari body permintaan untuk Pages Router
    const { topic, topics, numberOfQuestions, questionType } = req.body;
    const count = numberOfQuestions || 5;

    if (!topic && (!Array.isArray(topics) || topics.length === 0)) {
        return res.status(400).json({ error: "Topik tidak boleh kosong" });
    }

    // === LOGIKA PROMPT LENGKAP YANG DIKEMBALIKAN ===
    let prompt;
    let mainInstruction;
    const isMultiTopic = topics && topics.length > 0;

    if (questionType === 'multiple_choice') {
        mainInstruction = isMultiTopic
            ? `Buat total ${count} soal matematika tentang topik-topik berikut: ${topics.join(', ')}`
            : `Buat ${count} soal matematika tentang topik "${topic}".`;
        prompt = `${mainInstruction}
        Jenis soal harus Pilihan Ganda.
        Format respons dalam array JSON yang valid, setiap objek berisi:
        - "questionText": (string) teks soal.
        - "optionA": (string) teks pilihan A.
        - "optionB": (string) teks pilihan B.
        - "optionC": (string) teks pilihan C.
        - "optionD": (string) teks pilihan D.
        - "correctAnswer": (string) HANYA HURUF pilihan yang benar (misal: "A", "B", "C", atau "D").
        - "solution": (string) penjelasan singkat mengapa jawaban tersebut benar.
        Pastikan setiap soal memiliki 4 pilihan.`;
    } else { // Untuk soal Esai
        mainInstruction = isMultiTopic
            ? `Buat total ${count} soal matematika tentang topik-topik berikut: ${topics.join(', ')}`
            : `Buat ${count} soal matematika tentang topik "${topic}".`;
        prompt = `${mainInstruction}
        Jenis soal harus Esai.
        Format respons dalam array JSON yang valid dengan properti "questionText", "correctAnswer", dan "solution".`;
    }
    // === AKHIR DARI LOGIKA PROMPT YANG BENAR ===
    
    console.log("Memanggil Gemini AI dengan prompt yang benar...");
    const result = await model.generateContent(prompt);
    const questionsData = JSON.parse(result.response.text());

    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      console.error("AI returned invalid data format:", result.response.text());
      return res.status(500).json({ error: "Format respons dari AI tidak valid." });
    }

    console.log(`✅ Gemini berhasil membuat ${questionsData.length} soal draft.`);
    return res.status(200).json(questionsData);

  } catch (error) {
    // Menampilkan detail error dari Google jika ada
    console.error("❌ Terjadi kesalahan di API generate-only:", error);
    const errorMessage = error.message || "Gagal generate soal.";
    // Jika error karena overload, pesannya akan muncul di sini
    return res.status(500).json({ error: errorMessage });
  }
}
