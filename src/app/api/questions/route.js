import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT id, question, answer, created_at FROM questions ORDER BY created_at DESC");

    if (!rows.length) {
      // return NextResponse.json({ message: "Belum ada soal yang dibuat" }, { status: 200 });
      return NextResponse.json([], { status: 200 }); // ubah ini
    }

    // Format ulang `answer` agar lebih rapi
    const formattedRows = rows.map(row => ({
      ...row,
      answer: row.answer.replace(/\n/g, "\n\n") // Tambahkan newline ekstra agar lebih jelas di UI
    }));

    return NextResponse.json(formattedRows, { status: 200 });

  } catch (error) {
    console.error("❌ Gagal mengambil data dari database:", error);
    return NextResponse.json({ error: "Gagal mengambil data dari server" }, { status: 500 });
  }
}
