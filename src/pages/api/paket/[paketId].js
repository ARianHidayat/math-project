// LOKASI: src/pages/api/paket/[paketId].js
// API ini bertanggung jawab untuk menghapus satu paket soal spesifik.

import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    // Ambil ID paket dari URL, contoh: /api/paket/15
    const { paketId } = req.query;

    // Hanya izinkan metode DELETE untuk endpoint ini
    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user || !session.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const paketIdInt = parseInt(paketId);

        // Keamanan: Cek apakah paket soal ini benar-benar milik pengguna yang sedang login
        const paketSoal = await prisma.paketSoal.findUnique({
            where: { id: paketIdInt },
        });

        if (!paketSoal) {
            return res.status(404).json({ error: "Paket soal tidak ditemukan." });
        }

        if (paketSoal.userId !== session.user.id) {
            return res.status(403).json({ error: "Anda tidak memiliki izin untuk menghapus paket soal ini." });
        }

        // Jika semua aman, hapus paket soal.
        // Berkat `onDelete: Cascade` di skema Prisma Anda, semua soal, sesi kuis,
        // dan jawaban kuis yang terkait dengan paket ini akan ikut terhapus secara otomatis.
        await prisma.paketSoal.delete({
            where: { id: paketIdInt },
        });

        console.log(`✅ Paket Soal ID ${paketIdInt} berhasil dihapus oleh user ${session.user.id}`);
        return res.status(200).json({ message: "Paket soal berhasil dihapus." });

    } catch (error) {
        console.error(`❌ Gagal menghapus paket soal ID ${paketId}:`, error);
        return res.status(500).json({ error: "Terjadi kesalahan pada server." });
    } finally {
        await prisma.$disconnect();
    }
}
