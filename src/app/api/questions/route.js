// File: src/app/api/questions/route.js

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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // === PERUBAHAN LOGIKA DIMULAI DI SINI ===
    // Ambil semua PaketSoal milik user, dan sertakan (include) semua soal di dalamnya.
    const paketSoalList = await prisma.paketSoal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        questions: { // Sertakan semua data dari model Question yang terhubung
          orderBy: {
            id: 'asc' // Urutkan soal di dalam paket berdasarkan ID
          }
        },
      },
    });

    if (!paketSoalList.length) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(paketSoalList, { status: 200 });
    
  } catch (error) {
    console.error("❌ Gagal mengambil data dari database (Prisma):", error);
    return NextResponse.json({ error: "Gagal mengambil data dari server" }, { status: 500 });
  }
}