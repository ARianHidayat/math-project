// LOKASI: src/pages/components/HeroSection.jsx
// VERSI BARU: Dengan transisi "gelombang" yang halus dan penyesuaian padding.

import React from 'react';
import { TypeAnimation } from 'react-type-animation';

export default function HeroSection({ session, handleNavClick }) {
    const greeting = session ? `Halo, ${session.user.name || session.user.email}!` : 'Selamat Datang di';

    return (
        // Wrapper utama untuk hero section dan shape divider
        <div style={{ position: 'relative', backgroundColor: 'white' }}>
            {/* Bagian Hero dengan gradien */}
            <div className="container-fluid text-white text-center" style={{
                background: 'linear-gradient(135deg, #0d6efd, #0747a6)',
                paddingTop: '6rem', // Padding atas ditambah agar ada ruang di bawah navbar
                paddingBottom: '8rem' // Padding bawah untuk memberi ruang bagi gelombang
            }}>
                <div className="container">
                    <h3 className="fw-light mb-3" style={{ opacity: 0.8 }}>{greeting}</h3>
                    <h1 className="display-3 fw-bolder text-white">SOLMATE</h1>
                    <TypeAnimation
                        sequence={[
                            'Platform Pembuatan Soal Otomatis.', 2000,
                            'Latihan Soal Secara Interaktif.', 2000,
                            'Ekspor ke PDF dengan Mudah.', 2000,
                            'Sistem Koreksi Esai yang Cerdas.', 2000,
                        ]}
                        wrapper="p"
                        speed={50}
                        className="lead mb-4"
                        style={{ minHeight: '2.5em' }}
                        repeat={Infinity}
                    />
                    <p className="col-lg-8 mx-auto mb-5" style={{ opacity: 0.9 }}>
                        Ubah cara Anda membuat dan mengelola soal. Dari ide menjadi lembar kerja siap cetak dalam hitungan menit, didukung oleh kecerdasan buatan yang canggih untuk membantu para pendidik seperti Anda.
                    </p>
                    <button
                        type="button"
                        className="btn btn-light btn-lg px-5 py-3 fw-bold"
                        onClick={() => handleNavClick('/question-page')}
                    >
                        Mulai Buat Soal
                    </button>
                </div>
            </div>

            {/* Shape Divider "Gelombang" */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'rotate(180deg)' }}>
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '75px' }}>
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" style={{ fill: '#ffffff' }}></path>
                </svg>
            </div>
        </div>
    );
}
