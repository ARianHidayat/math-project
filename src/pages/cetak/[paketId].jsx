// LOKASI: src/pages/cetak/[paketId].jsx
// VERSI FINAL: Dengan opsi dropdown untuk memilih jenis cetakan.

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import Navbar from '../../components/navbar';
import LembarSoal from '../../components/LembarSoal';
import KunciJawaban from '../../components/KunciJawaban';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CetakPage({ paket }) {
    const router = useRouter();
    
    const [schoolName, setSchoolName] = useState('SMP Negeri 1 Cerdas');
    const [academicYear, setAcademicYear] = useState('2024/2025');
    const [examDate, setExamDate] = useState('Senin, 1 Agustus 2025');
    const [examTitle, setExamTitle] = useState(`Ujian ${paket?.topic || ''}`);
    const [logo, setLogo] = useState(null);
    const [showNilai, setShowNilai] = useState(true);
    const [printMode, setPrintMode] = useState('soal');
    // --- TAMBAHKAN STATE BARU DI SINI ---
    const [kelas, setKelas] = useState('');
    const [namaGuru, setNamaGuru] = useState('');
    if (router.isFallback || !paket) {
        return <div>Memuat data paket soal...</div>;
    }
    
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setLogo(reader.result); };
            reader.readAsDataURL(file);
        } else {
            setLogo(null);
        }
    };

    const handlePrint = () => { window.print(); };

    const printProps = { paket, schoolName, academicYear, examDate, examTitle, logo, showNilai, kelas, namaGuru };

    return (
        <div>
            <Navbar />
            <div className="container-fluid my-4 print-container">
                
                <div className="card shadow-sm mb-4 mx-auto print-hide" style={{ maxWidth: '21cm' }}>
                    <div className="card-header fw-bold text-center">Pengaturan Cetak & Ekspor</div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3"><label htmlFor="examTitle" className="form-label">Nama Ujian</label><input type="text" className="form-control" id="examTitle" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} /></div>
                            <div className="col-md-6 mb-3"><label htmlFor="schoolName" className="form-label">Nama/Alamat Sekolah</label><input type="text" className="form-control" id="schoolName" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} /></div>
                            <div className="col-md-6 mb-3"><label htmlFor="academicYear" className="form-label">Tahun Akademik</label><input type="text" className="form-control" id="academicYear" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} /></div>
                            <div className="col-md-6 mb-3"><label htmlFor="examDate" className="form-label">Hari / Tanggal</label><input type="text" className="form-control" id="examDate" value={examDate} onChange={(e) => setExamDate(e.target.value)} /></div>
                            {/* --- INPUT BARU DITAMBAHKAN DI SINI --- */}
                            <div className="col-md-6 mb-3"><label htmlFor="kelas" className="form-label">Kelas</label><input type="text" className="form-control" id="kelas" placeholder="Contoh: IX A" value={kelas} onChange={(e) => setKelas(e.target.value)} /></div>
                            <div className="col-md-6 mb-3"><label htmlFor="namaGuru" className="form-label">Nama Guru</label><input type="text" className="form-control" id="namaGuru" placeholder="Nama Guru Pengampu" value={namaGuru} onChange={(e) => setNamaGuru(e.target.value)} /></div>
                            <div className="col-md-12 mb-3"><label htmlFor="logo" className="form-label">Logo Sekolah (Opsional)</label><input type="file" className="form-control" id="logo" accept="image/*" onChange={handleLogoChange} /></div>
                        </div>
                        <div className="row align-items-end">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="printMode" className="form-label">Konten Cetak</label>
                                <select id="printMode" className="form-select" value={printMode} onChange={(e) => setPrintMode(e.target.value)}>
                                    <option value="soal">Lembar Soal Saja</option>
                                    <option value="jawaban">Kunci Jawaban Saja</option>
                                    <option value="keduanya">Soal dan Kunci Jawaban</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="showNilaiCheck" checked={showNilai} onChange={(e) => setShowNilai(e.target.checked)} />
                                    <label className="form-check-label" htmlFor="showNilaiCheck">
                                        Tampilkan Kotak Nilai di Header
                                    </label>
                                </div>
                            </div>
                        </div>
                         <div className="d-flex justify-content-end">
                            <button onClick={handlePrint} className="btn btn-primary">🖨️ Cetak / Simpan sebagai PDF</button>
                         </div>
                    </div>
                </div>

                <div className="bg-white shadow-lg mx-auto" style={{ maxWidth: '21cm' }}>
                    {(printMode === 'soal' || printMode === 'keduanya') && (
                        <LembarSoal {...printProps} />
                    )}
                    {printMode === 'keduanya' && (
                        <div style={{ pageBreakBefore: 'always', marginBottom: '1.5cm' }}>
                            <hr style={{ borderTop: '4px dashed #ccc' }} />
                        </div>
                    )}
                    {(printMode === 'jawaban' || printMode === 'keduanya') && (
                        <KunciJawaban {...printProps} />
                    )}
                </div>
            </div>
            <style jsx global>{`
                @media print {
                    .print-hide, .navbar, footer { display: none !important; }
                    .print-container { margin: 0 !important; padding: 0 !important; }
                    body { background-color: white !important; }
                    .shadow-lg { box-shadow: none !important; }
                }
            `}</style>
        </div>
    );
}

export async function getServerSideProps(context) {
    const prisma = new PrismaClient();
    const { paketId } = context.params;
    try {
        const paket = await prisma.paketSoal.findUnique({
            where: { id: parseInt(paketId) },
            include: { questions: true },
        });
        if (!paket) return { notFound: true };
        const serializablePaket = JSON.parse(JSON.stringify(paket));
        return { props: { paket: serializablePaket } };
    } catch (error) {
        console.error("Gagal mengambil data paket soal untuk dicetak:", error);
        return { notFound: true };
    } finally {
        await prisma.$disconnect();
    }
}