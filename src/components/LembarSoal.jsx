// LOKASI: src/pages/components/LembarSoal.jsx
// VERSI DIPERBAIKI: Layout header, area nama/kelas, dan padding halaman disesuaikan.

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const LembarSoal = ({ paket, schoolName, examTitle, logo, includeTopic }) => {
    // Komponen ini dibuat untuk menghindari pengulangan kode Markdown
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5cm' }}>
                {logo && <img src={logo} alt="logo" style={{ maxHeight: '70px', marginRight: '15px' }} />}
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '16pt', fontWeight: 'bold', margin: '0' }}>{schoolName}</h1>
                    <h2 style={{ fontSize: '14pt', fontWeight: 'bold', margin: '0' }}>{examTitle}</h2>
                    {includeTopic && <p style={{ fontSize: '11pt', margin: '5px 0 0 0' }}>Topik: {paket.topic}</p>}
                </div>
                 {/* Menambahkan div kosong jika ada logo, agar judul tetap di tengah sempurna */}
                {logo && <div style={{ width: '70px' }}></div>}
            </div>

            {/* PENYESUAIAN AREA NAMA/KELAS: Diapit dua garis dan jaraknya diringkas */}
            <hr style={{ borderTop: '1px solid black', margin: '0' }} />
            <table style={{ width: '100%', margin: '0.25cm 0', fontSize: '12pt' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '50%' }}>Nama: .......................................</td>
                        <td style={{ width: '50%' }}>Kelas: .......................................</td>
                    </tr>
                </tbody>
            </table>
            <hr style={{ borderTop: '1px solid black', marginBottom: '1cm' }} />
            
            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '0.5cm' }}>Jawablah pertanyaan-pertanyaan di bawah ini dengan benar!</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1cm' }}>
                {paket.questions.map((q, index) => (
                    <div key={q.id} style={{ display: 'flex' }}>
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