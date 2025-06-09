import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic, numberOfQuestions } = await req.json();
    const count = numberOfQuestions || 5;

    if (!topic) {
      return NextResponse.json({ error: "Topik tidak boleh kosong" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const prompt = `
      Buat ${count} soal matematika tentang topik "${topic}".
      Berikan respons dalam format JSON yang valid.
      Struktur JSON harus berupa sebuah array, di mana setiap objek dalam array memiliki TIGA properti: 
      1. "question" untuk isi soal.
      2. "solution" untuk langkah-langkah penyelesaiannya secara detail.
      3. "answer" untuk jawaban akhirnya saja.

      Pastikan hanya mengembalikan array JSON, tanpa teks atau format markdown tambahan.
      Contoh:
      [
        {
          "question": "Jika 2x + 5 = 15, berapakah nilai x?",
          "solution": "1. Kurangi kedua sisi dengan 5: 2x = 15 - 5, sehingga 2x = 10. 2. Bagi kedua sisi dengan 2: x = 10 / 2. 3. Maka, x = 5.",
          "answer": "x = 5"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const questionsData = JSON.parse(result.response.text());

    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      return NextResponse.json({ error: "Format respons dari AI tidak valid." }, { status: 500 });
    }

    // Buat satu entri PaketSoal terlebih dahulu
    const newPaketSoal = await prisma.paketSoal.create({
      data: {
        topic: topic,
        userId: user.id,
      },
    });

    const dataToSave = questionsData.map(item => ({
      question: item.question,
      answer: item.answer,
      solution: item.solution, // <-- TAMBAHKAN BARIS INI
      paketSoalId: newPaketSoal.id,
    }));

    await prisma.question.createMany({
      data: dataToSave,
    });

    console.log(`✅ ${dataToSave.length} soal berhasil disimpan dalam Paket ID: ${newPaketSoal.id}`);
    
    return NextResponse.json({
        id: newPaketSoal.id,
        topic: newPaketSoal.topic,
        createdAt: newPaketSoal.createdAt,
        questions: questionsData // Kirim data lengkap ke frontend
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Terjadi kesalahan di server:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}