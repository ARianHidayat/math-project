import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT id, question, answer, created_at FROM questions ORDER BY created_at DESC");

    if (!rows.length) {
      return NextResponse.json({ message: "Belum ada soal yang dibuat" }, { status: 200 });
    }

    return NextResponse.json(rows, { status: 200 });

  } catch (error) {
    console.error("❌ Gagal mengambil data dari database:", error);
    return NextResponse.json({ error: "Gagal mengambil data dari server" }, { status: 500 });
  }
}
