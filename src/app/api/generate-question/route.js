import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req) {
  try {
    console.log("📥 Menerima request...");
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topik tidak boleh kosong" }, { status: 400 });
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
      // Fallback jika format Gemini tidak sesuai
      question = fullResponse;
      answer = "Jawaban tidak ditemukan.";
    }

    const cleanAnswer = answer.replace(/\n/g, "\n\n");

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Simpan soal ke database lewat Prisma
    const saved = await prisma.question.create({
      data: {
        question,
        answer: cleanAnswer,
        userId: user.id,
      },
    });

    console.log("✅ Soal berhasil disimpan:", saved);

    return NextResponse.json({ question, answer: cleanAnswer }, { status: 200 });

  } catch (error) {
    console.error("❌ Terjadi kesalahan di server:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
