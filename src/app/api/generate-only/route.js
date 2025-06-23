// File: api/generate-only/route.js

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
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
    // Cek otentikasi, ini tetap penting
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic, topics, numberOfQuestions, questionType } = await req.json();
    const count = numberOfQuestions || 5;

    if (!topic && (!Array.isArray(topics) || topics.length === 0)) {
        return NextResponse.json({ error: "Topik tidak boleh kosong" }, { status: 400 });
    }

    // SEMUA LOGIKA PEMBUATAN PROMPT KITA PINDAHKAN KE SINI
    let prompt;
    let mainInstruction;
    const isMultiTopic = topics && topics.length > 0;

    if (isMultiTopic) {
        const numTopics = topics.length;
        const baseCountPerTopic = Math.floor(count / numTopics);
        let remainder = count % numTopics;
        let promptDetails = "";
        topics.forEach(t => {
            let countForThisTopic = baseCountPerTopic;
            if (remainder > 0) {
                countForThisTopic++;
                remainder--;
            }
            if (countForThisTopic > 0) {
               promptDetails += `- ${countForThisTopic} soal tentang topik '${t}'.\n`;
            }
        });
        mainInstruction = `Buat total ${count} soal matematika dengan rincian sebagai berikut:\n${promptDetails}`;
    } else {
        mainInstruction = `Buat ${count} soal matematika tentang topik "${topic}".`;
    }

    if (questionType === 'multiple_choice') {
        prompt = `
        ${mainInstruction}
        Jenis soal harus Pilihan Ganda. Format respons dalam array JSON yang valid dengan properti "question", "answer", dan "solution".
        Properti "solution" HARUS berupa JSON stringified yang berisi "options" (sebuah array dari 4 string) dan "explanation" (sebuah string).
        Contoh: "solution": "{\\"options\\":[\\"A\\",\\"B\\",\\"C\\",\\"D\\"],\\"explanation\\":\\"Penjelasan singkat.\\"}"
        `;
    } else {
        prompt = `
        ${mainInstruction}
        Jenis soal harus Esai. Format respons dalam array JSON yang valid dengan properti "question", "solution", dan "answer".
        `;
    }

    // Panggil Gemini AI
    const result = await model.generateContent(prompt);
    const questionsData = JSON.parse(result.response.text());

    // Periksa hasil dari AI
    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      return NextResponse.json({ error: "Format respons dari AI tidak valid." }, { status: 500 });
    }
    
    // Kembalikan hasil mentah ke frontend, TANPA MENYIMPAN KE DATABASE
    return NextResponse.json(questionsData, { status: 200 });

  } catch (error) {
    console.error("❌ Terjadi kesalahan di API generate-only:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server saat generate soal." }, { status: 500 });
  }
}