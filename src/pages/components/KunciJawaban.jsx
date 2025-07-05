// LOKASI: src/pages/components/KunciJawaban.jsx
// VERSI DIPERBAIKI: Layout header dan padding halaman disesuaikan, konsisten dengan LembarSoal.

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const KunciJawaban = ({ paket, schoolName, examTitle, logo, includeTopic }) => {

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
        // PENYESUAIAN PADDING: Atas/bawah lebih kecil, kanan/kiri lebih lebar
        <div style={{ fontFamily: 'Times New Roman, serif', fontSize: '12pt', padding: '0.5cm 1.5cm' }}>
            
            {/* PENYESUAIAN HEADER: Menggunakan Flexbox untuk membuat logo dan judul berdampingan */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1cm' }}>
                {logo && <img src={logo} alt="logo" style={{ maxHeight: '70px', marginRight: '15px' }} />}
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '16pt', fontWeight: 'bold', margin: '0' }}>KUNCI JAWABAN & PEMBAHASAN</h1>
                    <h2 style={{ fontSize: '14pt', fontWeight: 'normal', margin: '0' }}>{examTitle}</h2>
                    {includeTopic && <p style={{ fontSize: '11pt', margin: '5px 0 0 0' }}>Topik: {paket.topic}</p>}
                </div>
                {/* Menambahkan div kosong jika ada logo, agar judul tetap di tengah sempurna */}
                {logo && <div style={{ width: '70px' }}></div>}
            </div>

            <hr style={{ borderTop: '1px solid black', marginBottom: '1cm' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2cm' }}>
                {paket.questions.map((q, index) => (
                    <div key={q.id}>
                        <div style={{ display: 'flex', marginBottom: '0.4cm' }}>
                            <div style={{ marginRight: '0.5cm', fontWeight: 'bold' }}>{index + 1}.</div>
                            <div style={{ flex: 1 }}>
                                <MarkdownWithoutMargin>{q.questionText}</MarkdownWithoutMargin>
                                {q.optionA && (
                                    <ol type="A" style={{ paddingLeft: '20px', margin: '0.5cm 0 0 0', listStylePosition: 'inside' }}>
                                        <li>{q.optionA}</li>
                                        <li>{q.optionB}</li>
                                        <li>{q.optionC}</li>
                                        <li>{q.optionD}</li>
                                    </ol>
                                )}
                            </div>
                        </div>

                        <div style={{ marginLeft: 'calc(0.5cm + 1em)', fontSize: '12pt' }}>
                            <div style={{ marginBottom: '0.25cm', display: 'flex' }}>
                                <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Jawaban:</span>
                                <span>{getCorrectAnswerText(q)}</span>
                            </div>
                            <div style={{ borderLeft: '2px solid #ddd', paddingLeft: '15px' }}>
                                <div style={{ display: 'flex' }}>
                                    <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Pembahasan:</span>
                                    <div style={{ flex: 1 }}>
                                        <MarkdownWithoutMargin>{q.solution || "Tidak ada pembahasan."}</MarkdownWithoutMargin>
                                    </div>
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