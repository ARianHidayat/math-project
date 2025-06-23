// File: src/pages/components/PaketSoalCard.jsx

import React, { useState } from "react";
import ReactDOMServer from 'react-dom/server';
import LembarSoal from "./LembarSoal";
import KunciJawaban from "./KunciJawaban";
// BARU: Impor kedua mesin pintar kita yang sudah terpisah
import SmartQuestionDisplay from "./SmartQuestionDisplay";
import SmartAnswerDisplay from "./SmartAnswerDisplay";

// HAPUS: Komponen bantu QuestionDisplay dan AnswerDisplay yang tadinya ada di sini,
// karena fungsinya sudah dipindahkan ke file terpisah.

export default function PaketSoalCard({ paket }) {
    // Kumpulan state dan fungsi Anda SAMA PERSIS, tidak ada yang diubah.
    const [showAnswers, setShowAnswers] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [schoolName, setSchoolName] = useState("Nama Sekolah Anda");
    const [examTitle, setExamTitle] = useState("Ujian Tengah Semester");
    const [logo, setLogo] = useState(null);
    const [printMode, setPrintMode] = useState('soal');

    const handleLogoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setLogo(URL.createObjectURL(e.target.files[0]));
        }
    };

    const openPrintModal = (mode) => {
        setPrintMode(mode);
        setIsModalOpen(true);
    };

    const handlePrint = () => {
        let componentToPrint;
        if (printMode === 'soal') {
            componentToPrint = <LembarSoal paket={paket} schoolName={schoolName} examTitle={examTitle} logo={logo} />;
        } else if (printMode === 'jawaban') {
            componentToPrint = <KunciJawaban paket={paket} schoolName={schoolName} examTitle={examTitle} logo={logo} />;
        } else {
            componentToPrint = (
                <>
                    <LembarSoal paket={paket} schoolName={schoolName} examTitle={examTitle} logo={logo} />
                    <div style={{ pageBreakBefore: 'always' }}></div>
                    <KunciJawaban paket={paket} schoolName={schoolName} examTitle={examTitle} logo={logo} />
                </>
            );
        }
        const printHtml = ReactDOMServer.renderToString(componentToPrint);
        const styles = Array.from(document.styleSheets).map(s => { try { return Array.from(s.cssRules).map(r=>r.cssText).join('') } catch (e) { return `<link rel="stylesheet" href="${s.href}">` }}).join('\n');
        const printWindow = window.open('', '_blank', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write(`<html><head><title>Cetak</title><style>${styles}</style></head><body>${printHtml}</body></html>`);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-light d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
                    <div className="mb-2 mb-sm-0 text-center text-sm-start">
                        <h2 className="h5 fw-bold mb-1">Topik: {paket.topic}</h2>
                        <p className="text-sm text-muted mb-0">
                            📅 Dibuat pada: {new Date(paket.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="btn-group flex-shrink-0">
                        <button type="button" className="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            🖨️ Cetak / Ekspor PDF
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className="dropdown-item" type="button" onClick={() => openPrintModal('soal')}>Cetak Lembar Soal Saja</button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => openPrintModal('jawaban')}>Cetak Kunci Jawaban</button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => openPrintModal('keduanya')}>Cetak Keduanya</button></li>
                        </ul>
                    </div>
                </div>
                
                <div className="card-body">
                    {/* MODIFIKASI: Tampilan soal sekarang menggunakan komponen dari luar */}
                    {paket.questions.map((q, index) => (
                        <div key={q.id} className={index < paket.questions.length - 1 ? "mb-3 border-bottom pb-3" : ""}>
                           <div className="p-3 bg-light rounded">
                               {/* Mesin pintar kita dipanggil di sini */}
                               <SmartQuestionDisplay question={q} index={index} />
                           </div>
                       </div>
                    ))}
                    
                    <button className="btn btn-outline-primary mt-4" onClick={() => setShowAnswers(!showAnswers)}>
                        {showAnswers ? 'Sembunyikan' : 'Tampilkan'} Jawaban & Penyelesaian
                    </button>

                    {showAnswers && (
                        <div className="mt-3">
                            <hr/>
                            {/* MODIFIKASI: Tampilan jawaban juga menggunakan komponen dari luar */}
                            {paket.questions.map((q, index) => (
                                <SmartAnswerDisplay key={`sol-${q.id}`} question={q} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal tidak ada perubahan */}
            {isModalOpen && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Pengaturan Cetak</h5>
                                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Pengaturan Header</label>
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
                                <div className="mt-3">
                                    <label className="form-label fw-bold">Jenis Dokumen yang Akan Dicetak</label>
                                    <div className="alert alert-info py-2">
                                        Anda akan mencetak: <strong>{printMode === 'soal' ? 'Lembar Soal Saja' : (printMode === 'jawaban' ? 'Kunci Jawaban Saja' : 'Soal & Kunci Jawaban')}</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Tutup</button>
                                <button type="button" className="btn btn-primary" onClick={handlePrint}>
                                    Lanjutkan Mencetak
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}