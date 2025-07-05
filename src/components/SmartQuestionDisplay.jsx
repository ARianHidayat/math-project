// LOKASI: src/pages/components/SmartQuestionDisplay.jsx

import React from 'react';
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Komponen ini HANYA menampilkan pertanyaan dan pilihan (jika ada)
export default function SmartQuestionDisplay({ question, index }) {
    // Kumpulkan semua opsi yang ada (optionA, B, C, D) ke dalam array
    const options = [
        question.optionA,
        question.optionB,
        question.optionC,
        question.optionD
    ].filter(Boolean); // .filter(Boolean) untuk menghapus opsi yang null

    return (
        <>
            <p className="fw-bold mb-2">📝 Soal #{index + 1}:</p>
            <div className="p-3 bg-light rounded">
                {/* Tampilkan teks soal dari properti yang BENAR: questionText */}
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {question.questionText || "Teks soal tidak ditemukan."}
                </ReactMarkdown>

                {/* Jika ada opsi (soal pilihan ganda), tampilkan sebagai daftar */}
                {options.length > 0 && (
                    <ol type="A" style={{ paddingLeft: '20px', marginTop: '10px' }}>
                        {options.map((option, i) => (
                            <li key={i}>
                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={{ p: React.Fragment }}>
                                    {option}
                                </ReactMarkdown>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </>
    );
}