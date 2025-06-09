// File: src/pages/questions-output/index.jsx

import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/navbar";

export default function QuestionsOutputPage() {
  // 1. State sekarang untuk menampung daftar Paket Soal
  const [paketSoalList, setPaketSoalList] = useState([]);
  const [loading, setLoading] = useState(true);
  // 2. Refs sekarang untuk setiap paket, bukan setiap soal
  const paketRefs = useRef({});

  useEffect(() => {
    async function fetchPaketSoal() {
      try {
        const response = await fetch("/api/questions");
        const data = await response.json();

        if (Array.isArray(data)) {
          setPaketSoalList(data);
          // Inisialisasi refs untuk setiap paket
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
  }, []);

  // 3. Fungsi download sekarang menargetkan seluruh paket
  const downloadPaketPDF = (paketId) => {
    const input = paketRefs.current[paketId]?.current;
    if (!input) return;

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`paket_soal_${paketId}.pdf`);
    });
  };

  return (
    <div className=" mx-auto">
      <Navbar />
      <h1 className="h2 font-bold text-center mb-6">Riwayat Paket Soal</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : paketSoalList.length === 0 ? (
        <div className="text-center text-gray-500 card p-4">Belum ada paket soal yang dibuat.</div>
      ) : (
        <div className="space-y-6">
          {/* 4. Loop terluar untuk setiap PAKET SOAL */}
          {paketSoalList.map((paket) => (
            // Referensi sekarang ada di div pembungkus paket
            <div key={paket.id} ref={paketRefs.current[paket.id]} className="card shadow-sm mb-4">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="h5 font-bold mb-1">Topik: {paket.topic}</h2>
                </div>
                <button
                  onClick={() => downloadPaketPDF(paket.id)}
                  className="btn btn-primary"
                >
                  📄 Download Paket
                </button>
              </div>

              <div className="card-body">
                {/* 5. Loop dalam untuk setiap SOAL di dalam paket */}
                {paket.questions.map((q, index) => (
                  <div key={q.id} className={index < paket.questions.length - 1 ? "mb-4 border-bottom pb-3" : "mb-2"}>
                    <p className="font-semibold">📝 Soal #{index + 1}:</p>
                    <div className="p-3 bg-light rounded">
                      <ReactMarkdown>{q.question}</ReactMarkdown>
                    </div>

                    <p className="font-semibold mt-3">✅ Jawaban:</p>
                    <div className="p-3 bg-light rounded">
                      <ReactMarkdown>{q.answer}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card-footer">
                  <p className="text-sm text-muted mb-0">
                    📅 Dibuat pada: {new Date(paket.createdAt).toLocaleString()}
                  </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}