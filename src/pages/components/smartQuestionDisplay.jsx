// File: src/pages/components/SmartQuestionDisplay.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';

// Komponen ini menerima 1 soal (question) dan nomornya (index)
// Tugasnya adalah menampilkan soal + pilihan gandanya jika ada.
const SmartQuestionDisplay = ({ question, index }) => {
    let options = null;
    try {
        const parsedSolution = JSON.parse(question.solution);
        if (Array.isArray(parsedSolution.options)) {
            options = parsedSolution.options;
        }
    } catch (e) {
        // Ini soal esai, biarkan options null
    }

    return (
        <div className="d-flex align-items-start">
            <span className="me-2 fw-bold">{index + 1}.</span>
            <div className="w-100">
                {/* Tampilkan isi pertanyaan */}
                <ReactMarkdown>{question.question}</ReactMarkdown>
                
                {/* Jika ada options, tampilkan sebagai daftar A, B, C, D */}
                {options && (
                    <ol type="A" style={{ paddingLeft: '20px', marginTop: '10px' }}>
                        {options.map((option, i) => (
                            <li key={i}>
                                <ReactMarkdown components={{ p: React.Fragment }}>
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

export default SmartQuestionDisplay;