// LOKASI: src/pages/components/DraftQuestionCard.jsx
// Gantikan seluruh isi file dengan kode ini.

import React from 'react';
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Komponen kecil untuk menampilkan soal Esai atau Pilihan Ganda secara pintar
// VERSI INI SUDAH DIPERBAIKI SESUAI STRUKTUR DATA DARI GEMINI & PRISMA
const SmartQuestionDisplay = ({ question }) => {
    // Kumpulkan semua opsi yang ada (optionA, optionB, dst.) ke dalam sebuah array
    // .filter(Boolean) berguna untuk menghapus opsi yang null atau kosong (jika soalnya esai)
    const options = [
        question.optionA,
        question.optionB,
        question.optionC,
        question.optionD
    ].filter(Boolean);

    return (
        <div className="p-3 bg-light rounded">
            {/* Menampilkan teks soal dari properti yang BENAR: questionText */}
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {question.questionText || "Teks soal tidak ditemukan."}
            </ReactMarkdown>

            {/* Jika ada opsi (ini soal pilihan ganda), tampilkan sebagai daftar */}
            {options.length > 0 && (
                <ol type="A" style={{ paddingLeft: '20px', marginTop: '10px' }}>
                    {options.map((option, i) => (
                        <li key={i}>
                            {/* Gunakan ReactMarkdown agar format matematika (jika ada) bisa ditampilkan */}
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={{ p: React.Fragment }}>
                                {option}
                            </ReactMarkdown>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};

// Komponen utama untuk kartu draft
const DraftQuestionCard = ({ question, index, onDelete, onReplace, isReplacing, onToggleHot, isHot }) => {

    // Jika soal ditandai sebagai "dihapus", tampilkan tombol untuk generate pengganti
    if (question.isDeleted) {
        return (
            <div className="d-flex justify-content-center align-items-center p-3 my-3 border rounded bg-light">
                <button 
                    className="btn btn-primary" 
                    onClick={() => onReplace(index)}
                    disabled={isReplacing}
                >
                    {isReplacing ? 'Membuat...' : '🔄 Buat Soal Pengganti'}
                </button>
            </div>
        );
    }
    
    // Tampilan normal untuk soal
    return (
        // Tambahkan class border-warning jika soalnya HOT
        <div className={`card shadow-sm mb-3 ${isHot ? 'border-warning border-2' : ''}`}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <p className="fw-bold mb-2">📝 Soal #{index + 1}:</p>
                    <div className="d-flex gap-2">
                        {/* --- TOMBOL BARU UNTUK SOAL HOT --- */}
                        <button 
                            className={`btn btn-sm ${isHot ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
                            onClick={() => onToggleHot(question.tempId)}
                            title="Tandai sebagai soal HOT (skor lebih tinggi)"
                        >
                            🔥
                        </button>
                        <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => onDelete(question.tempId)}
                            title="Hapus soal ini"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
                <SmartQuestionDisplay question={question} />
            </div>
        </div>
    );
};

export default DraftQuestionCard;