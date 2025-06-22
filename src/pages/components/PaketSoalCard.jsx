// File: src/pages/components/PaketSoalCard.jsx

import React, { useState } from "react";
import ReactDOMServer from 'react-dom/server';
import ReactMarkdown from "react-markdown";
import LembarSoal from "./LembarSoal";
import KunciJawaban from "./KunciJawaban";

// --- KOMPONEN BANTU (Tidak ada perubahan) ---

const QuestionDisplay = ({ question, index }) => {
    let options = null;
    try {
        const parsedSolution = JSON.parse(question.solution);
        if (Array.isArray(parsedSolution.options)) {
            options = parsedSolution.options;
        }
    } catch (e) {
        // Biarkan options null jika bukan soal PG
    }

    return (
        <div key={question.id} className={index < 100 ? "mb-3 border-bottom pb-3" : "mb-3"}>
            <p className="fw-bold">📝 Soal #{index + 1}:</p>
            <div className="p-3 bg-light rounded">
                <ReactMarkdown>{question.question}</ReactMarkdown>
                
                {options && (
                    <ol type="A" style={{ paddingLeft: '20px', marginTop: '10px' }}>
                        {options.map((option, i) => (
                            <li key={i}>
                                <ReactMarkdown
                                    components={{
                                        p: React.Fragment,
                                    }}
                                >
                                    {option}
                                </ReactMarkdown>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    );
};

const AnswerDisplay = ({ question, index }) => {
    let explanation = question.solution;
    try {
        const parsedSolution = JSON.parse(question.solution);
        if (parsedSolution && parsedSolution.explanation) {
            explanation = parsedSolution.explanation;
        }
    } catch (e) {
        // Biarkan 'explanation' berisi 'solution' asli (untuk esai)
    }

    return (
        <div key={`sol-${question.id}`} className={index < 100 ? "mt-3 border-bottom pb-3" : "mt-3"}>
            <h6 className="fw-bold">Penyelesaian Soal #{index + 1}:</h6>
            <div className="p-3 bg-secondary-subtle rounded mb-2">
                <ReactMarkdown>{explanation}</ReactMarkdown>
            </div>
            <h6 className="fw-bold">Jawaban Akhir:</h6>
            <div className="p-3 bg-light rounded">
                <ReactMarkdown>{question.answer}</ReactMarkdown>
            </div>
        </div>
    );
}

// --- KOMPONEN UTAMA ---
export default function PaketSoalCard({ paket }) {
    // Kumpulan state tidak berubah
    const [showAnswers, setShowAnswers] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [schoolName, setSchoolName] = useState("Nama Sekolah Anda");
    const [examTitle, setExamTitle] = useState("Ujian Tengah Semester");
    const [logo, setLogo] = useState(null);
    const [printMode, setPrintMode] = useState('soal');

    // Kumpulan fungsi tidak berubah
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
                {/* --- PERBAIKAN UTAMA ADA DI BARIS DI BAWAH INI --- */}
                <div className="card-header bg-light d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
                    {/* Di mobile, margin-bottom (mb-2). Di layar small ke atas, margin-bottom 0 (mb-sm-0) */}
                    <div className="mb-2 mb-sm-0 text-center text-sm-start">
                        <h2 className="h5 fw-bold mb-1">Topik: {paket.topic}</h2>
                        <p className="text-sm text-muted mb-0">
                            📅 Dibuat pada: {new Date(paket.createdAt).toLocaleString()}
                        </p>
                    </div>
                    
                    <div className="btn-group flex-shrink-0"> {/* flex-shrink-0 mencegah tombol menyusut */}
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
                    {paket.questions.map((q, index) => (
                        <QuestionDisplay key={q.id} question={q} index={index} />
                    ))}
                    
                    <button className="btn btn-outline-primary mt-4" onClick={() => setShowAnswers(!showAnswers)}>
                        {showAnswers ? 'Sembunyikan' : 'Tampilkan'} Jawaban & Penyelesaian
                    </button>

                    {showAnswers && (
                        <div className="mt-3">
                            <hr/>
                            {paket.questions.map((q, index) => (
                                <AnswerDisplay key={`sol-${q.id}`} question={q} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal tidak ada perubahan */}
            {isModalOpen && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    {/* ... (Isi modal Anda sama seperti sebelumnya) ... */}
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