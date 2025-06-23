// kalau masih ada komentar ini, berarti kode ini masih belum digunakan atau diperlukan

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

    // MODIFIKASI: Ambil juga 'questionType' dari body request
    const { topic, topics, numberOfQuestions, questionType } = await req.json();
    const count = numberOfQuestions || 5;

    if (!topic && (!Array.isArray(topics) || topics.length === 0)) {
        return NextResponse.json({ error: "Topik tidak boleh kosong" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    let prompt;
    let mainInstruction;
    const isMultiTopic = topics && topics.length > 0;

    // Langkah 1: Tentukan instruksi utama berdasarkan mode topik (single/multiple)
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

    // BARU: Langkah 2: Pilih template prompt berdasarkan tipe soal (essay/multiple_choice)
    if (questionType === 'multiple_choice') {
        // Prompt khusus untuk Pilihan Ganda
        prompt = `
        ${mainInstruction}
        Jenis soal harus Pilihan Ganda.
        Berikan respons dalam format JSON yang valid.
        Struktur JSON harus berupa sebuah array, di mana setiap objek dalam array memiliki TIGA properti:
        1. "question": (String) untuk isi soal.
        2. "answer": (String) untuk jawaban yang BENAR.
        3. "solution": (String) yang berisi JSON stringified dengan DUA properti:
            a. "options": (Array of Strings) berisi 4 pilihan jawaban, SALAH SATUNYA harus sama persis dengan nilai "answer".
            b. "explanation": (String) berisi langkah-langkah atau penjelasan kenapa jawaban itu benar.

        Contoh format respons yang diinginkan:
        [
          {
            "question": "Berapa hasil dari 7 x 6?",
            "answer": "42",
            "solution": "{\\"options\\":[\\"36\\",\\"42\\",\\"48\\",\\"54\\"],\\"explanation\\":\\"Perkalian 7 dengan 6 menghasilkan 42.\\"}"
          }
        ]
        `;
    } else {
        // Prompt untuk Esai (seperti sebelumnya)
        prompt = `
        ${mainInstruction}
        Jenis soal harus Esai.
        Berikan respons dalam format JSON yang valid.
        Struktur JSON harus berupa sebuah array, di mana setiap objek dalam array memiliki TIGA properti:
        1. "question": (String) untuk isi soal.
        2. "solution": (String) untuk langkah-langkah penyelesaiannya secara detail.
        3. "answer": (String) untuk jawaban akhirnya saja.

        Contoh format respons yang diinginkan:
        [
          {
            "question": "Jika 2x + 5 = 15, berapakah nilai x?",
            "solution": "1. Kurangi kedua sisi dengan 5: 2x = 15 - 5, sehingga 2x = 10. 2. Bagi kedua sisi dengan 2: x = 10 / 2. 3. Maka, x = 5.",
            "answer": "x = 5"
          }
        ]
        `;
    }

    const result = await model.generateContent(prompt);
    const questionsData = JSON.parse(result.response.text());

    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      return NextResponse.json({ error: "Format respons dari AI tidak valid." }, { status: 500 });
    }

    const paketTopic = isMultiTopic ? topics.join(', ') : topic;

    const newPaketSoal = await prisma.paketSoal.create({
      data: {
        topic: paketTopic, 
        userId: user.id,
      },
    });

    const dataToSave = questionsData.map(item => ({
      question: item.question,
      answer: item.answer,
      solution: item.solution,
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
        questions: questionsData
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Terjadi kesalahan di server:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}