// File: src/pages/questions-output/index.jsx

import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/navbar";
import PaketSoalCard from "../components/PaketSoalCard"; // <-- Impor komponen baru

export default function QuestionsOutputPage() {
  const [paketSoalList, setPaketSoalList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Impor bootstrap JS di client-side
    import('bootstrap/dist/js/bootstrap.bundle.min.js');

    async function fetchPaketSoal() {
      try {
        const response = await fetch("/api/questions");
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
  }, []);

  return (
    <div className="mx-auto">
      <Navbar />
      <h1 className="h2 font-bold text-center mb-6">Riwayat Paket Soal</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : paketSoalList.length === 0 ? (
        <div className="text-center text-gray-500 card p-4">Belum ada paket soal yang dibuat.</div>
      ) : (
        <div>
          {/* Loop sekarang menjadi sangat sederhana */}
          {paketSoalList.map((paket) => (
            <PaketSoalCard key={paket.id} paket={paket} />
          ))}
        </div>
      )}
    </div>
  );
}