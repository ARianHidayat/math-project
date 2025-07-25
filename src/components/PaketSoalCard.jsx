// LOKASI: src/pages/components/PaketSoalCard.jsx
// VERSI FINAL: Lengkap dengan semua logika Anda dan tambahan opsi cetak.

import React, { useState } from "react";
import ReactDOMServer from 'react-dom/server';
import Link from 'next/link';

// Impor komponen-komponen pembantu
import LembarSoal from "./LembarSoal";
import KunciJawaban from "./KunciJawaban";
import SmartQuestionDisplay from "./SmartQuestionDisplay";
import SmartAnswerDisplay from "./SmartAnswerDisplay";

export default function PaketSoalCard({ paket }) {
    const [showAnswers, setShowAnswers] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State untuk pengaturan cetak
    const [schoolName, setSchoolName] = useState("Nama Sekolah Anda");
    const [examTitle, setExamTitle] = useState("Ujian Tengah Semester");
    const [logo, setLogo] = useState(null);
    const [printMode, setPrintMode] = useState('soal');
    // State BARU untuk opsi sertakan topik
    const [includeTopic, setIncludeTopic] = useState(true); 

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
        // Menambahkan 'includeTopic' ke props yang akan dikirim
        const printProps = { paket, schoolName, examTitle, logo, includeTopic };

        if (printMode === 'soal') {
            componentToPrint = <LembarSoal {...printProps} />;
        } else if (printMode === 'jawaban') {
            componentToPrint = <KunciJawaban {...printProps} />;
        } else { // keduanya
            componentToPrint = (
                <>
                    <LembarSoal {...printProps} />
                    <div style={{ pageBreakBefore: 'always' }}></div>
                    <KunciJawaban {...printProps} />
                </>
            );
        }

        const printHtml = ReactDOMServer.renderToString(componentToPrint);
        
        const printStyles = `
            @page { 
                size: auto;  
                margin: 20mm; 
            } 
            @media print {
                body { margin: 0; }
                .print-header, .print-footer { display: none !important; }
            }
        `;

        const printWindow = window.open('', '_blank', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write(`<html><head><title>${examTitle}</title><style>${printStyles}</style></head><body>${printHtml}</body></html>`);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-light d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center gap-2">
                    <div className="text-center text-sm-start me-sm-auto">
                        <h2 className="h5 fw-bold mb-1">Topik: {paket.topic}</h2>
                        <p className="text-sm text-muted mb-0">
                            📅 Dibuat pada: {new Date(paket.createdAt).toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="d-flex gap-2">
                        <Link href={`/latihan/${paket.id}`} className="btn btn-success text-white">
                            🚀 Mulai Latihan
                        </Link>
                        
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
                </div>
                
                <div className="card-body">
                    {paket.questions.map((q, index) => (
                        <div key={q.id} className={index < paket.questions.length - 1 ? "mb-3 border-bottom pb-3" : ""}>
                             <SmartQuestionDisplay question={q} index={index} />
                        </div>
                    ))}
                    
                    <button className="btn btn-outline-primary mt-4" onClick={() => setShowAnswers(!showAnswers)}>
                        {showAnswers ? 'Sembunyikan' : 'Tampilkan'} Jawaban & Penyelesaian
                    </button>

                    {showAnswers && (
                        <div className="mt-3">
                            <hr/>
                            {paket.questions.map((q, index) => (
                                <SmartAnswerDisplay key={`sol-${q.id}`} question={q} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Pengaturan Cetak */}
            {isModalOpen && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Pengaturan Cetak & Ekspor</h5>
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

                                <div className="mb-3">
                                     <label className="form-label fw-bold">Opsi Konten</label>
                                     <div className="form-check">
                                         <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            checked={includeTopic} 
                                            onChange={(e) => setIncludeTopic(e.target.checked)}
                                            id="includeTopicCheck"
                                        />
                                         <label className="form-check-label" htmlFor="includeTopicCheck">
                                             Sertakan Info Topik di Header
                                         </label>
                                     </div>
                                </div>
                                
                                <div className="mt-3">
                                    <label className="form-label fw-bold">Dokumen yang Akan Dicetak</label>
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
