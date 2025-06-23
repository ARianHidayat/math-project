import React from 'react';
import ReactMarkdown from "react-markdown";

// Komponen kecil untuk menampilkan soal Esai atau Pilihan Ganda secara pintar
const SmartQuestionDisplay = ({ question }) => {
    let options = null;
    try {
        const parsedSolution = JSON.parse(question.solution);
        if (Array.isArray(parsedSolution.options)) {
            options = parsedSolution.options;
        }
    } catch (e) {
        // Bukan soal PG, biarkan
    }

    return (
        <div className="p-3 bg-light rounded">
            <ReactMarkdown>{question.question}</ReactMarkdown>
            {options && (
                <ol type="A" style={{ paddingLeft: '20px', marginTop: '10px' }}>
                    {options.map((option, i) => (
                        <li key={i}>
                            <ReactMarkdown components={{ p: React.Fragment }}>{option}</ReactMarkdown>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};

// Komponen utama untuk kartu draft
const DraftQuestionCard = ({ question, index, onDelete, onReplace, isReplacing }) => {

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
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <p className="fw-bold mb-2">📝 Soal #{index + 1}:</p>
                    <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => onDelete(question.tempId)}
                        title="Hapus soal ini"
                    >
                        🗑️
                    </button>
                </div>
                <SmartQuestionDisplay question={question} />
            </div>
        </div>
    );
};

export default DraftQuestionCard;