// File: checkUser.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Mencari user di database...');
  try {
    const firstUser = await prisma.user.findFirst({
      // Mengambil user pertama yang ada di tabel
    });

    if (firstUser) {
      console.log('✅ User ditemukan! Silakan gunakan ID di bawah ini:');
      console.log('----------------------------------------------------');
      console.log(firstUser.id);
      console.log('----------------------------------------------------');
      console.log('Salin ID di atas dan lanjutkan ke langkah berikutnya.');
    } else {
      console.log('❌ Tidak ada user yang ditemukan di database.');
      console.log('Silakan daftar atau masuk ke aplikasi Anda terlebih dahulu untuk membuat user pertama.');
    }
  } catch (error) {
    console.error('Terjadi error saat mengakses database:', error.message);
    if (error.code === 'P2021') {
        console.error('Ini kemungkinan karena tabel "User" belum ada. Coba hapus folder /migrations dan jalankan "npx prisma migrate dev" dari awal.');
    }
  } finally {
    await prisma.$disconnect()
  }
}

main();