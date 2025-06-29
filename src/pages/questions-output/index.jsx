// LOKASI: src/pages/questions-output/index.jsx
// VERSI BARU: Dengan logika redirect yang aman jika pengguna belum login.

import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSession, signIn } from "next-auth/react"; // Impor useSession dan signIn

// Impor komponen Anda
import Navbar from "../components/navbar";
import PaketSoalCard from "../components/PaketSoalCard";
import ScrollToTopButton from "../components/ScrollToTopButton";

export default function QuestionsOutputPage() {
    const { data: session, status } = useSession(); // Gunakan useSession untuk cek status
    const [paketSoalList, setPaketSoalList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Impor bootstrap JS di client-side
        import('bootstrap/dist/js/bootstrap.bundle.min.js');

        // === LOGIKA PERLINDUNGAN HALAMAN ===
        // Jika status BUKAN 'loading' dan pengguna TIDAK terautentikasi...
        if (status !== "loading" && status === "unauthenticated") {
            // ...gunakan fungsi signIn() dari NextAuth untuk redirect yang benar.
            signIn();
            return; // Hentikan eksekusi lebih lanjut
        }
        
        // Jika pengguna sudah terautentikasi, baru ambil data
        if (status === "authenticated") {
            async function fetchPaketSoal() {
                try {
                    const response = await fetch("/api/questions");
                    if (!response.ok) throw new Error("Gagal mengambil data");
                    const data = await response.json();
                    setPaketSoalList(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error("Gagal mengambil data paket soal:", error);
                    setPaketSoalList([]);
                } finally {
                    setLoading(false);
                }
            }
            fetchPaketSoal();
        }

    }, [status]); // useEffect akan berjalan setiap kali status berubah

    // Tampilkan pesan loading saat sesi sedang diperiksa atau data diambil
    if (status === "loading" || loading) {
        return (
             <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div>Memuat Riwayat Soal...</div>
            </div>
        );
    }
    
    // Jika tidak diautentikasi, jangan render apa pun
    if (status === "unauthenticated") {
        return null;
    }

    return (
        <div className="mx-auto">
            <Navbar />
            <div className="container mt-5">
                <h1 className="h2 fw-bold text-center mb-5">Riwayat Paket Soal</h1>
                
                {paketSoalList.length === 0 ? (
                    <div className="text-center text-muted card p-5 shadow-sm">
                        <p className="h5">Anda belum memiliki riwayat.</p>
                        <p>Mulai buat paket soal pertama Anda dan riwayatnya akan muncul di sini.</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {/* Loop untuk menampilkan setiap paket soal */}
                        {paketSoalList.map((paket) => (
                            <PaketSoalCard key={paket.id} paket={paket} />
                        ))}
                    </div>
                )}
            </div>
            <ScrollToTopButton/>
        </div>
    );
}
