// LOKASI: src/components/KunciJawaban.jsx
// VERSI BARU: Dengan header yang konsisten dan format yang lebih rapi.

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
            
            {/* --- HEADER BARU YANG KONSISTEN DENGAN LEMBAR SOAL --- */}
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
            {/* <hr style={{ borderTop: '1px solid black', margin: '0.5cm 0 1cm 0' }} /> */}
            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '0.5cm' }}>Berikut adalah kunci jawaban & pembahasan!</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1cm' }}>
                {paket.questions.map((q, index) => (
                    <div key={q.id}>
                        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.4cm' }}>
                            <div style={{ marginRight: '0.5cm', fontWeight: 'bold' }}>{index + 1}.</div>
                            <div style={{ flex: 1, fontWeight: 'bold' }}>
                                 <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Jawaban:</span>
                                 <span>{getCorrectAnswerText(q)}</span>
                            </div>
                        </div>

                        <div style={{ marginLeft: 'calc(0.5cm + 1em)', fontSize: '11pt', borderLeft: '2px solid #eee', paddingLeft: '15px' }}>
                            <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Pembahasan:</span>
                            <div style={{ display: 'inline-block', flex: 1 }}>
                                <MarkdownWithoutMargin>{q.solution || "Tidak ada pembahasan."}</MarkdownWithoutMargin>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KunciJawaban;