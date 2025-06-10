// File: src/pages/components/PaketSoalCard.jsx

import React, { useState, useRef,useEffect } from "react";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Komponen ini menerima satu 'paket' soal sebagai prop
export default function PaketSoalCard({ paket }) {
  // 1. State untuk mengontrol visibilitas jawaban & solusi untuk kartu INI SAJA
  const [showAnswers, setShowAnswers] = useState(false);
  const cardRef = useRef(null);

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

  const downloadPaketPDF = () => {
    const input = cardRef.current;
    if (!input) return;

    // Tampilkan jawaban sementara sebelum download agar masuk ke PDF
    setShowAnswers(true);
    
    // Beri sedikit waktu agar DOM diperbarui sebelum di-capture
    setTimeout(() => {
        html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = 210;
            const imgWidth = pdfWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save(`paket_soal_${paket.id}.pdf`);

            // Kembalikan ke kondisi semula jika Anda ingin jawaban kembali tersembunyi setelah download
            // setShowAnswers(false); 
        });
    }, 100); // Waktu tunggu 100ms
  };

  return (
    <div ref={cardRef} className="card shadow-sm mb-4">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
          <h2 className="h5 font-bold mb-1">Topik: {paket.topic}</h2>
          <p className="text-sm text-muted mb-0">
            📅 Dibuat pada: {new Date(paket.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={downloadPaketPDF}
          className="btn btn-primary"
        >
          📄 Download Paket
        </button>
      </div>

      <div className="card-body">
        {paket.questions.map((q, index) => (
          <div key={q.id} className={index < paket.questions.length - 1 ? "mb-4 border-bottom pb-3" : "mb-2"}>
            <p className="font-semibold">📝 Soal {index + 1}:</p>
            <div className="p-3 bg-light rounded">
              <ReactMarkdown>{q.question}</ReactMarkdown>
            </div>
          </div>
        ))}
        
        {/* Tombol untuk toggle jawaban */}
        <button 
            className="btn btn-outline-primary mt-3" 
            onClick={() => setShowAnswers(!showAnswers)}
        >
            {showAnswers ? 'Sembunyikan' : 'Tampilkan'} Jawaban & Penyelesaian
        </button>

        {/* 2. Tampilkan bagian ini hanya jika showAnswers bernilai true */}
        {showAnswers && (
            <div className="mt-4">
                <hr/>
                {paket.questions.map((q, index) => (
                    <div key={`sol-${q.id}`} className="mt-3">
                        <p className="font-semibold">Penyelesaian Soal {index + 1}:</p>
                        <div className="p-3 bg-secondary-subtle rounded mb-2">
                            <ReactMarkdown>{q.solution}</ReactMarkdown>
                        </div>
                        <p className="font-semibold">Jawaban Akhir:</p>
                        <div className="p-3 bg-success-subtle rounded">
                            <ReactMarkdown>{q.answer}</ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}