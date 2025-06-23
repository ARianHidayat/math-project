// File: api/save-paket/route.js

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TERIMA DATA FINAL DARI FRONTEND
    const { topic, questions } = await req.json();

    if (!topic || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "Data paket soal tidak lengkap." }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // SEMUA LOGIKA PENYIMPANAN PRISMA ADA DI SINI
    const newPaketSoal = await prisma.paketSoal.create({
      data: {
        topic: topic, 
        userId: user.id,
      },
    });

    const dataToSave = questions.map(item => ({
      question: item.question,
      answer: item.answer,
      solution: item.solution,
      paketSoalId: newPaketSoal.id,
    }));

    await prisma.question.createMany({
      data: dataToSave,
    });

    console.log(`✅ ${dataToSave.length} soal berhasil disimpan dalam Paket ID: ${newPaketSoal.id}`);
    
    // Kembalikan paket yang sudah tersimpan dengan ID barunya
    return NextResponse.json({
        id: newPaketSoal.id,
        topic: newPaketSoal.topic,
        createdAt: newPaketSoal.createdAt,
        questions: questions
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Terjadi kesalahan di API save-paket:", error);
    return NextResponse.json({ error: "Gagal menyimpan paket soal ke database." }, { status: 500 });
  }
}