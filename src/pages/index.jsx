// LOKASI: src/pages/index.js
// VERSI BARU: Mengadaptasi komponen HeroSection ke dalam struktur kode Anda yang sudah ada.

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from 'next/link'; // <-- PERBAIKAN: Baris ini telah ditambahkan

// Impor semua komponen yang Anda gunakan
import Navbar from "./components/navbar";
import LoginForm from "./components/loginForm";
import Footer from "./components/footer";
import HomeCard from "./components/HomeCard";
import InspirationalQuote from "./components/InspirationalQuotes";
import HowItWorks from "./components/HowItWorks";
import HeroSection from "./components/HeroSection"; // <-- Impor komponen baru kita
import ScrollToTopButton from "./components/ScrollToTopButton";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fungsi logika handleNavClick Anda tetap dipertahankan
  const handleNavClick = (path) => {
    if (!session) {
      router.push('/auth/signin');
    } else {
      router.push(path);
    }
  };

  if (status === "loading") {
    return <div className="text-center p-5">Loading...</div>;
  }

  // Sekarang kita gunakan satu return statement yang lebih bersih
  return (
    <div>
      <Navbar />

      {/*
        PANGGIL KOMPONEN HERO BARU DI SINI.
        Komponen ini akan secara otomatis menampilkan sapaan yang berbeda
        tergantung apakah pengguna sudah login atau belum.
      */}
      <HeroSection session={session} handleNavClick={handleNavClick} />
      
      {/* Bagian ini akan selalu tampil, baik sudah login maupun belum */}
      <div className="container py-5">
        <HomeCard />
        <HowItWorks />
        <InspirationalQuote />

        {/*
          Tampilkan form login HANYA JIKA pengguna belum login.
          Ini menggantikan struktur if/else Anda yang sebelumnya.
        */}
        {!session && (
          <div className="text-center my-5 py-5 border-top border-bottom">
            <div className="container">
                <h2 className="fw-bold">Siap Menjadi Ahli Matematika?</h2>
                <p className="lead text-muted col-lg-8 mx-auto">
                    Buat akun gratis untuk menyimpan semua paket soal, melihat riwayat latihan, dan mengakses semua fitur canggih SOLMATE.
                </p>
                <Link href="/auth/signin" className="btn btn-primary btn-lg ...">
                    Masuk atau Daftar Gratis
                </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ScrollToTopButton/>
    </div>
  );
}
