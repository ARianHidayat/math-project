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
      Struktur JSON harus berupa sebuah array, di mana setiap objek dalam array memiliki dua properti: "question" untuk soal dan "answer" untuk jawaban.
      Pastikan hanya mengembalikan array JSON, tanpa teks atau format markdown tambahan.
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

    // === PERBAIKAN ADA DI SINI ===
    // Siapkan data soal untuk dihubungkan ke paket yang baru dibuat
    const dataToSave = questionsData.map(item => ({
      question: item.question,
      answer: item.answer,
      // Ganti 'userId' dengan 'paketSoalId' yang benar
      paketSoalId: newPaketSoal.id, 
    }));

    // Simpan semua soal ke database menggunakan createMany
    await prisma.question.createMany({
      data: dataToSave,
    });

    console.log(`✅ ${dataToSave.length} soal berhasil disimpan dalam Paket ID: ${newPaketSoal.id}`);
    
    return NextResponse.json({
        id: newPaketSoal.id,
        topic: newPaketSoal.topic,
        createdAt: newPaketSoal.createdAt,
        questions: questionsData
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Terjadi kesalahan di server:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}