// LOKASI: src/pages/components/SmartAnswerDisplay.jsx

import React from 'react';
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Helper function untuk mendapatkan teks jawaban yang benar berdasarkan hurufnya
const getCorrectAnswerText = (question) => {
    if (!question || !question.correctAnswer) return "Tidak ada jawaban.";
    
    const answerKey = question.correctAnswer.toUpperCase(); // misal: "A", "B", ...
    
    if (answerKey === 'A') return question.optionA;
    if (answerKey === 'B') return question.optionB;
    if (answerKey === 'C') return question.optionC;
    if (answerKey === 'D') return question.optionD;
    
    // Jika bukan PG (misal, soal esai), tampilkan langsung jawabannya
    return question.correctAnswer;
}

// Komponen ini HANYA menampilkan penyelesaian dan jawaban akhir
export default function SmartAnswerDisplay({ question, index }) {
    const correctAnswerText = getCorrectAnswerText(question);

    return (
        <div className="mb-4">
            <h6 className="fw-bold">Penyelesaian Soal #{index + 1}:</h6>
            <div className="p-3 bg-secondary bg-opacity-10 rounded mb-2">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {question.solution || "Tidak ada penyelesaian."}
                </ReactMarkdown>
            </div>
            
            <h6 className="fw-bold">Jawaban Akhir:</h6>
            <div className="p-3 bg-success bg-opacity-10 rounded text-success fw-bold">
                 <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {correctAnswerText}
                </ReactMarkdown>
            </div>
        </div>
    );
}