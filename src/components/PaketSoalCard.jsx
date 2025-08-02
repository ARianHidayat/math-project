// LOKASI: src/components/PaketSoalCard.jsx
// VERSI BERSIH FINAL: Semua logika cetak/modal yang lama sudah dihapus total.

import React, { useState } from "react";
import Link from 'next/link';

// Impor komponen-komponen pembantu
import SmartQuestionDisplay from "./SmartQuestionDisplay";
import SmartAnswerDisplay from "./SmartAnswerDisplay";
import {  BsDownload, BsPrinter } from "react-icons/bs";


export default function PaketSoalCard({ paket }) {
    // HANYA state ini yang dipertahankan
    const [showAnswers, setShowAnswers] = useState(false);

    // Semua fungsi handlePrint, openPrintModal, dll. TELAH DIHAPUS.

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-light d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center gap-2">
                <div className="text-center text-sm-start me-sm-auto">
                    <h2 className="h5 fw-bold mb-1">Topik: {paket.topic}</h2>
                    <p className="text-sm text-muted mb-0">
                        📅 Dibuat pada: {new Date(paket.createdAt).toLocaleString('id-ID')}
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <Link href={`/cetak/${paket.id}`} className="btn btn-sm btn-outline-secondary ms-2 fw-bold" title="Cetak Paket Soal">
                        <BsDownload /> 
                    </Link>
                    {/* Hanya Tombol Latihan yang tersisa */}
                    <Link href={`/latihan/${paket.id}`} className="btn btn-success text-white">
                        🚀 Mulai Latihan
                    </Link>
                    {/* Tombol dropdown cetak/ekspor sudah dihapus dari sini */}
                </div>
            </div>
            
            <div className="card-body">
                {paket.questions.map((q, index) => (
                    <div key={q.id || index} className={index < paket.questions.length - 1 ? "mb-3 border-bottom pb-3" : ""}>
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
                            <SmartAnswerDisplay key={`sol-${q.id || index}`} question={q} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
        // Tidak ada lagi kode Modal di sini.
    );
}