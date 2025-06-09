import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/navbar";

// Hapus import 'Collapse' dari sini, karena kita akan memuatnya di useEffect
// import { Collapse } from 'bootstrap'; 

export default function QuestionsOutputPage() {
  const [paketSoalList, setPaketSoalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const paketRefs = useRef({});

  useEffect(() => {
    // --- PERBAIKAN DIMULAI DI SINI ---
    // Impor JavaScript Bootstrap hanya di sisi klien setelah komponen dimuat.
    // Ini memastikan kode yang mengakses 'document' tidak berjalan di server.
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
    // --- AKHIR PERBAIKAN ---

    async function fetchPaketSoal() {
      try {
        const response = await fetch("/api/questions");
        const data = await response.json();

        if (Array.isArray(data)) {
          setPaketSoalList(data);
          paketRefs.current = data.reduce((acc, paket) => {
            acc[paket.id] = React.createRef();
            return acc;
          }, {});
        } else {
          setPaketSoalList([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data paket soal:", error);
        setPaketSoalList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPaketSoal();
  }, []); // Dependensi array kosong memastikan ini hanya berjalan sekali di klien.

  const downloadPaketPDF = (paketId) => {
    // ... (Fungsi downloadPDF Anda tidak perlu diubah)
  };

  return (
    <div className="mx-auto">
      <Navbar />
      <h1 className="h2 font-bold text-center mb-6">Riwayat Paket Soal</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : paketSoalList.length === 0 ? (
        <div className="text-center text-gray-500 card p-4">Belum ada paket soal yang dibuat.</div>
      ) : (
        <div className="space-y-6">
          {paketSoalList.map((paket) => (
            <div key={paket.id} ref={paketRefs.current[paket.id]} className="card shadow-sm mb-4">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="h5 font-bold mb-1">Topik: {paket.topic}</h2>
                  <p className="text-sm text-muted mb-0">
                    📅 Dibuat pada: {new Date(paket.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => downloadPaketPDF(paket.id)}
                  className="btn btn-primary"
                >
                  📄 Download Paket
                </button>
              </div>

              <div className="card-body">
                {paket.questions.map((q, index) => (
                  <div key={q.id} className={index < paket.questions.length - 1 ? "mb-4 border-bottom pb-3" : "mb-2"}>
                    <p className="font-semibold">📝 Soal #{index + 1}:</p>
                    <div className="p-3 bg-light rounded">
                      <ReactMarkdown>{q.question}</ReactMarkdown>
                    </div>
                    
                    <button 
                      className="btn btn-outline-secondary btn-sm mt-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target={`#solution-${q.id}`}
                      aria-expanded="false"
                    >
                      Tampilkan/Sembunyikan Penyelesaian
                    </button>

                    <div className="collapse mt-2" id={`solution-${q.id}`}>
                      <div className="p-3 bg-secondary-subtle rounded">
                         <p className="font-semibold">Langkah Penyelesaian:</p>
                         <ReactMarkdown>{q.solution}</ReactMarkdown>
                      </div>
                    </div>

                    <p className="font-semibold mt-3">✅ Jawaban Akhir:</p>
                    <div className="p-3 bg-light rounded">
                      <ReactMarkdown>{q.answer}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}