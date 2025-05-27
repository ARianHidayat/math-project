import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
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

    const formattedQuestions = questions.map((q) => ({
      ...q,
      answer: q.answer.replace(/\n/g, "\n\n"), // biar tampilannya rapi
    }));

    return NextResponse.json(formattedQuestions, { status: 200 });
  } catch (error) {
    console.error("❌ Gagal mengambil data dari database (Prisma):", error);
    return NextResponse.json({ error: "Gagal mengambil data dari server" }, { status: 500 });
  }
}
