import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Pastikan Anda menggunakan model yang mendukung output JSON, seperti model flash terbaru.
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export async function POST(req) {
  try {
    console.log("📥 Menerima request untuk generate banyak soal...");
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Terima 'topic' dan 'numberOfQuestions' dari body request
    const { topic, numberOfQuestions } = await req.json();
    const count = numberOfQuestions || 5; // Default 5 soal jika tidak dispesifikasikan

    if (!topic) {
      return NextResponse.json({ error: "Topik tidak boleh kosong" }, { status: 400 });
    }

    console.log(`📌 Topik: "${topic}", Jumlah Soal: ${count}`);

    // 2. Buat prompt baru yang meminta output JSON
    const prompt = `
      Buat ${count} soal matematika tentang topik "${topic}".
      Berikan respons dalam format JSON yang valid.
      Struktur JSON harus berupa sebuah array, di mana setiap objek dalam array memiliki dua properti: "question" untuk soal dan "answer" untuk jawaban.
      Pastikan hanya mengembalikan array JSON, tanpa teks atau format markdown tambahan.
      Contoh:
      [
        {
          "question": "Soal pertama...",
          "answer": "Jawaban pertama..."
        },
        {
          "question": "Soal kedua...",
          "answer": "Jawaban kedua..."
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log("🤖 Output mentah dari Gemini:", responseText);

    // 3. Parsing respons JSON dari Gemini
    let questionsData;
    try {
      questionsData = JSON.parse(responseText);
    } catch (e) {
      console.error("❌ Gagal mem-parsing JSON dari Gemini:", e);
      return NextResponse.json({ error: "Gagal memproses respons dari AI. Coba lagi." }, { status: 500 });
    }

    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      return NextResponse.json({ error: "Format respons dari AI tidak valid." }, { status: 500 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // 4. Siapkan data untuk disimpan ke database
    const dataToSave = questionsData.map(item => ({
      question: item.question,
      answer: item.answer,
      userId: user.id,
    }));

    // 5. Simpan semua soal ke database menggunakan createMany
    const savedResult = await prisma.question.createMany({
      data: dataToSave,
      skipDuplicates: true, // Opsional: untuk menghindari error jika ada duplikat
    });

    console.log(`✅ ${savedResult.count} soal berhasil disimpan.`);

    // 6. Kirim kembali array soal yang sudah dibuat
    return NextResponse.json({ questions: questionsData }, { status: 200 });

  } catch (error) {
    console.error("❌ Terjadi kesalahan di server:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}