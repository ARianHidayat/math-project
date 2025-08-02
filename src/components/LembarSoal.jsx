// LOKASI: src/components/LembarSoal.jsx
// VERSI BARU: Menampilkan Logo dan Nilai, serta menyeimbangkan header

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const LembarSoal = ({ paket, schoolName, examTitle, academicYear, examDate, logo, showNilai }) => {
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5cm', borderBottom: '3px double black', paddingBottom: '10px' }}>
                <div style={{ flex: 1, textAlign: 'left' }}>
                    {logo && <img src={logo} alt="logo" style={{ maxHeight: '80px' }} />}
                </div>
                <div style={{ flex: 2, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '16pt', fontWeight: 'bold', margin: '0' }}>{schoolName || '....................................................'}</h1>
                    <h2 style={{ fontSize: '14pt', fontWeight: 'bold', margin: '0' }}>{examTitle}</h2>
                    {academicYear && <p style={{ fontSize: '11pt', margin: '5px 0 0 0' }}>Tahun Akademik: {academicYear}</p>}
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                    {/* --- KOTAK NILAI BARU DI SINI --- */}
                    {showNilai && (
                        <div style={{ border: '2px solid black', padding: '10px', width: '100px', display: 'inline-block', textAlign: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid black', paddingBottom: '5px' }}>Nilai</h3>
                            <div style={{ height: '40px' }}></div>
                        </div>
                    )}
                </div>
            </div>
            <table style={{ width: '100%', margin: '0.5cm 0', fontSize: '12pt' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '50%' }}>Nama: .......................................</td>
                        <td style={{ width: '50%' }}>{examDate ? `Hari/Tanggal: ${examDate}` : 'Hari/Tanggal: ..............................'}</td>
                    </tr>
                     <tr>
                        <td style={{ width: '50%' }}>Kelas: .......................................</td>
                        <td style={{ width: '50%' }}>Nilai: .......................................</td>
                    </tr>
                </tbody>
            </table>
            <hr style={{ borderTop: '1px solid black', margin: '0 0 1cm 0' }} />
            
            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '0.5cm' }}>Jawablah pertanyaan-pertanyaan di bawah ini dengan benar!</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1cm' }}>
                {paket.questions.map((q, index) => (
                    <div key={q.id} style={{ display: 'flex', alignItems: 'baseline' }}>
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
                ))}
            </div>
        </div>
    );
};

export default LembarSoal;