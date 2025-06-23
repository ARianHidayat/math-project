// File: src/pages/components/SmartAnswerDisplay.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';

const SmartAnswerDisplay = ({ question, index }) => {
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
        // MODIFIKASI: Hapus logika className yang mengatur border.
        // Komponen ini sekarang lebih fokus dan bersih.
        <div className="mt-3">
            <h6 className="fw-bold">Penyelesaian Soal #{index + 1}:</h6>
            <div className="p-3 bg-secondary-subtle rounded mb-2">
                <ReactMarkdown>{explanation}</ReactMarkdown>
            </div>
            <h6 className="fw-bold">Jawaban Akhir:</h6>
            <div className="p-3 bg-success-subtle rounded">
                <ReactMarkdown>{question.answer}</ReactMarkdown>
            </div>
        </div>
    );
};

export default SmartAnswerDisplay;