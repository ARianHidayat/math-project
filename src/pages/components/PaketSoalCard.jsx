// File: src/pages/components/PaketSoalCard.jsx

import React, { useState, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import ReactMarkdown from "react-markdown";
import LembarUjian from "./LembarUjian";

export default function PaketSoalCard({ paket }) {
  // --- STATE ---
  const [showAnswers, setShowAnswers] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schoolName, setSchoolName] = useState("Nama Sekolah Anda");
  const [examTitle, setExamTitle] = useState("Ujian Tengah Semester");
  const [logo, setLogo] = useState(null);
  
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  // --- FUNGSI CETAK MANUAL (TANPA LIBRARY) ---
  const handleManualPrint = () => {
    const printHtml = ReactDOMServer.renderToString(
      <LembarUjian 
        paket={paket} 
        schoolName={schoolName}
        examTitle={examTitle}
        logo={logo}
      />
    );

    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
          try {
              return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('');
          } catch (e) {
              return `<link rel="stylesheet" href="${styleSheet.href}">`;
          }
      }).join('\n');

    const printWindow = window.open('', '_blank', 'height=800,width=800');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak - ${paket.topic}</title>
            <style>${styles}</style>
          </head>
          <body>${printHtml}</body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {/* KARTU YANG TAMPIL DI LAYAR */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h5 font-bold mb-1">Topik: {paket.topic}</h2>
            <p className="text-sm text-muted mb-0">
              📅 Dibuat pada: {new Date(paket.createdAt).toLocaleString()}
            </p>
          </div>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={() => setIsModalOpen(true)}
          >
            🖨️ Cetak / Ekspor ke PDF
          </button>
        </div>
        
        {/* === [FIX] INI ADALAH BAGIAN ISI KARTU YANG SEBELUMNYA HILANG === */}
        <div className="card-body">
          {paket.questions.map((q, index) => (
            <div key={q.id} className={index < paket.questions.length - 1 ? "mb-3 border-bottom pb-3" : ""}>
              <p className="font-semibold">📝 Soal #{index + 1}:</p>
              <div className="p-3 bg-light rounded">
                <ReactMarkdown>{q.question}</ReactMarkdown>
              </div>
            </div>
          ))}
          
          <button 
              className="btn btn-outline-primary mt-4" 
              onClick={() => setShowAnswers(!showAnswers)}
          >
              {showAnswers ? 'Sembunyikan' : 'Tampilkan'} Jawaban & Penyelesaian
          </button>

          {showAnswers && (
              <div className="mt-3">
                  <hr/>
                  {paket.questions.map((q, index) => (
                      <div key={`sol-${q.id}`} className="mt-3">
                          <h6 className="font-semibold">Penyelesaian Soal #{index + 1}:</h6>
                          <div className="p-3 bg-secondary-subtle rounded mb-2">
                              <ReactMarkdown>{q.solution}</ReactMarkdown>
                          </div>
                          <h6 className="font-semibold">Jawaban Akhir:</h6>
                          <div className="p-3 bg-light rounded">
                              <ReactMarkdown>{q.answer}</ReactMarkdown>
                          </div>
                      </div>
                  ))}
              </div>
          )}
        </div>
      </div>

      {/* MODAL YANG DIKONTROL OLEH REACT */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Pengaturan Cetak</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <p>Atur header dokumen sebelum mencetak.</p>
                <div className="mb-2">
                    <label className="form-label">Nama Sekolah:</label>
                    <input type="text" className="form-control" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Judul Ujian:</label>
                    <input type="text" className="form-control" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Logo Sekolah:</label>
                    <input type="file" className="form-control" accept="image/*" onChange={handleLogoChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Tutup</button>
                <button type="button" className="btn btn-primary" onClick={handleManualPrint}>
                  Cetak Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}