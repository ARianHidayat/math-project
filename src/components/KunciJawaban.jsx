// LOKASI: src/components/KunciJawaban.jsx
// VERSI FINAL: Sekarang menampilkan soal di atas setiap jawaban.

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const KunciJawaban = ({ paket, schoolName, examTitle, academicYear, logo, showNilai }) => {

    const getCorrectAnswerText = (question) => {
        if (!question.optionA) return question.correctAnswer || "";
        const key = question.correctAnswer.toUpperCase();
        if (key === 'A') return `A. ${question.optionA}`;
        if (key === 'B') return `B. ${question.optionB}`;
        if (key === 'C') return `C. ${question.optionC}`;
        if (key === 'D') return `D. ${question.optionD}`;
        return "Jawaban tidak valid";
    };

    const MarkdownWithoutMargin = ({ children }) => (
        <ReactMarkdown
            components={{ p: ({ node, ...props }) => <p {...props} style={{ margin: 0 }} /> }}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
        >
            {children}
        </ReactMarkdown>
    );

    return (
        <div style={{ fontFamily: 'Times New Roman, serif', fontSize: '12pt', padding: '1.5cm' }}>
            
            {/* Header tidak berubah */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5cm', borderBottom: '3px double black', paddingBottom: '10px' }}>
                <div style={{ flex: 1, textAlign: 'left' }}>
                    {logo && <img src={logo} alt="logo" style={{ maxHeight: '70px' }} />}
                </div>
                <div style={{ flex: 2, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '16pt', fontWeight: 'bold', margin: '0' }}>KUNCI JAWABAN & PEMBAHASAN</h1>
                    <h2 style={{ fontSize: '14pt', fontWeight: 'normal', margin: '0' }}>{examTitle}</h2>
                    {academicYear && <p style={{ fontSize: '11pt', margin: '5px 0 0 0' }}>Tahun Akademik: {academicYear}</p>}
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                    {/* {showNilai && (
                        <div style={{ border: '2px solid black', padding: '10px', width: '100px', display: 'inline-block' }}>
                            <h3 style={{ margin: 0, fontSize: '14pt', fontWeight: 'bold', borderBottom: '1px solid black', paddingBottom: '5px', textAlign: 'center' }}>Nilai</h3>
                            <div style={{ height: '40px' }}></div>
                        </div>
                    )} */}
                </div>
            </div>
            
            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', margin: '1cm 0' }}>Berikut adalah kunci jawaban & pembahasan!</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1cm' }}>
                {paket.questions.map((q, index) => (
                    <div key={q.id}>
                        {/* --- BAGIAN BARU: MENAMPILKAN SOAL --- */}
                        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.5cm' }}>
                            <div style={{ marginRight: '0.5cm', fontWeight: 'bold' }}>{index + 1}.</div>
                            <div style={{ flex: 1 }}>
                                <MarkdownWithoutMargin>{q.questionText}</MarkdownWithoutMargin>
                                {q.optionA && (
                                    <ol type="A" style={{ paddingLeft: '20px', margin: '0.5cm 0 0 0', listStylePosition: 'inside', listStyleType: 'upper-alpha' }}>
                                        <li>{q.optionA}</li>
                                        <li>{q.optionB}</li>
                                        <li>{q.optionC}</li>
                                        <li>{q.optionD}</li>
                                    </ol>
                                )}
                            </div>
                        </div>

                        {/* --- Jawaban dan Pembahasan (sedikit modifikasi gaya) --- */}
                        <div style={{ marginLeft: 'calc(0.5cm + 1em)', fontSize: '11pt', backgroundColor: '#f7f7f7', borderLeft: '3px solid #ccc', padding: '10px' }}>
                            <div style={{ marginBottom: '0.25cm', display: 'flex' }}>
                                <span style={{ fontWeight: 'bold', marginRight: '5px', flexShrink: 0 }}>Jawaban:</span>
                                <span>{getCorrectAnswerText(q)}</span>
                            </div>
                             <div>
                                <span style={{ fontWeight: 'bold', marginRight: '5px', flexShrink: 0 }}>Pembahasan:</span>
                                <div style={{ display: 'inline-block', flex: 1 }}>
                                    <MarkdownWithoutMargin>{q.solution || "Tidak ada pembahasan."}</MarkdownWithoutMargin>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KunciJawaban;