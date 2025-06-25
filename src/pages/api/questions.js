// LOKASI: src/pages/api/questions.js
// API ini bertugas untuk mengambil SEMUA riwayat Paket Soal milik pengguna

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
// Impor ini mengasumsikan file authOptions ada di './auth/[...nextauth].js'
// relatif terhadap folder 'api'
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

// Handler untuk Pages Router menggunakan (req, res)
export default async function handler(req, res) {
  // Hanya izinkan permintaan dengan metode GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Mengambil data sesi dari permintaan (request)
    const session = await getServerSession(req, res, authOptions);

    // Memastikan pengguna sudah login dan sesinya valid serta berisi ID
    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Mengambil semua PaketSoal dari database yang dimiliki oleh user yang sedang login
    const paketSoalList = await prisma.paketSoal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }, // Urutkan dari yang terbaru
      // BAGIAN PALING PENTING:
      // Memastikan SEMUA kolom dari tabel 'questions' yang terhubung ikut diambil.
      include: {
        questions: { // 'true' adalah cara sederhana untuk mengatakan "ambil semua kolom"
          orderBy: {
            id: 'asc' // Urutkan soal di dalam setiap paket berdasarkan ID
          }
        },
      },
    });

    // Mengembalikan daftar paket soal sebagai respons JSON dengan status sukses
    return res.status(200).json(paketSoalList);
    
  } catch (error) {
    // Jika terjadi error, catat di terminal dan kirim respons error ke klien
    console.error("❌ Gagal mengambil riwayat paket soal:", error);
    return res.status(500).json({ error: "Gagal mengambil data dari server" });
  } finally {
    // Pastikan koneksi ke database selalu ditutup setelah operasi selesai
    await prisma.$disconnect();
  }
}
