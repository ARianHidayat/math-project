import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req) {
  try {
    console.log("📥 Menerima request...");
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic tidak boleh kosong" }, { status: 400 });
    }

    console.log("📌 Topik yang diterima:", topic);

    // Generate soal dari Gemini
    const result = await model.generateContent(`Buat soal matematika tentang ${topic} dan berikan jawabannya.`);
    const fullResponse = result.response.text();

    console.log("📌 Output dari Gemini:", fullResponse);

    // Pisahkan soal dan jawaban berdasarkan keyword yang digunakan oleh Gemini
    const questionIndex = fullResponse.indexOf("**Soal:**");
    const answerIndex = fullResponse.indexOf("**Jawaban:**");

    let question = "";
    let answer = "";

    if (questionIndex !== -1 && answerIndex !== -1) {
      question = fullResponse.substring(questionIndex + 8, answerIndex).trim();
      answer = fullResponse.substring(answerIndex + 10).trim();
    } else {
      // Jika format tidak sesuai, gunakan fullResponse sebagai fallback
      question = fullResponse;
      answer = "Jawaban tidak ditemukan.";
    }

    // Hapus karakter markdown `**`, `*`, dan newline tambahan yang tidak diperlukan
    const cleanAnswer = answer
      .replace(/\*\*/g, "") // Menghapus `**bold**`
      .replace(/\*/g, "") // Menghapus `*italic*`
      .replace(/\n{2,}/g, "\n") // Menghapus newline berlebihan

    console.log("✅ Soal yang disimpan:", question);
    console.log("✅ Jawaban yang disimpan:", cleanAnswer);

    // Simpan ke database dengan teks yang sudah dibersihkan
    await pool.query(
      "INSERT INTO questions (question, answer, created_at) VALUES (?, ?, NOW())",
      [question, cleanAnswer]
    );

    return NextResponse.json({ question, answer: cleanAnswer }, { status: 200 });

  } catch (error) {
    console.error("❌ Terjadi kesalahan di server:", error.message);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
