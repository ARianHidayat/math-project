import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cari user berdasarkan email dari session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Ambil soal yang hanya milik user ini
    const questions = await prisma.question.findMany({
      where: { userId: user.id },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        question: true,
        answer: true,
        created_at: true,
      },
    });

    if (!questions.length) {
      return NextResponse.json([], { status: 200 });
    }

    // Format jawaban agar tampilannya rapi
    const formattedQuestions = questions.map((q) => ({
      ...q,
      answer: q.answer.replace(/\n/g, "\n\n"),
    }));

    return NextResponse.json(formattedQuestions, { status: 200 });
  } catch (error) {
    console.error("❌ Gagal mengambil data dari database (Prisma):", error);
    return NextResponse.json({ error: "Gagal mengambil data dari server" }, { status: 500 });
  }
}
