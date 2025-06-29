// LOKASI: src/pages/auth/verify-request.js (atau file halaman verifikasi Anda)
// VERSI BARU: Dengan desain yang lebih modern dan selaras dengan halaman login.

import React from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function VerifyRequestPage() {
    return (
        <>
            {/* Menggunakan style yang sama dengan halaman login untuk konsistensi */}
            <style jsx global>{`
                body {
                    background-color: #f8f9fa;
                }
            `}</style>
            <style jsx>{`
                .verify-container {
                    display: flex;
                    min-height: 100vh;
                    align-items: center;
                    justify-content: center;
                }
                .verify-card {
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    max-width: 900px;
                    min-height: 550px;
                    border-radius: 1rem;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .branding-section {
                    background: linear-gradient(135deg, #198754, #157347); /* Warna hijau untuk membedakan */
                    color: white;
                    padding: 3rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    width: 45%;
                }
                .content-section {
                    background: white;
                    padding: 3rem;
                    width: 55%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-align: center;
                }
                 @media (max-width: 768px) {
                    .branding-section {
                        display: none;
                    }
                    .content-section {
                        width: 100%;
                    }
                    .verify-card {
                        flex-direction: column;
                         min-height: auto;
                    }
                }
            `}</style>

            <div className="verify-container p-3">
                <div className="verify-card">
                    {/* Bagian Kiri (Branding) - dengan warna berbeda */}
                    <div className="branding-section">
                        <h1 className="fw-bold mb-3">Satu Langkah Lagi...</h1>
                        <p className="lead">Magic link telah dikirimkan untuk Anda.</p>
                        <p className="mt-4 opacity-75 small">Buka email Anda dan klik link tersebut untuk menyelesaikan proses login dengan aman. Link hanya berlaku untuk beberapa saat.</p>
                    </div>

                    {/* Bagian Kanan (Informasi & Aksi) */}
                    <div className="content-section">
                        <h2 className="fw-bold mb-3">Cek Kotak Masuk Anda</h2>
                        <p className="text-muted mb-4">
                            Kami telah mengirimkan tautan untuk masuk ke email Anda. Silakan periksa kotak masuk (atau folder spam) dan klik link tersebut.
                        </p>
                        
                        <div className="d-grid gap-3">
                             <button
                                onClick={() => window.open("https://mail.google.com/", "_blank")}
                                type='button'
                                className="btn btn-danger"
                              >
                                Buka Gmail
                              </button>
                              {/* <button
                                onClick={() => window.open("https://outlook.live.com/", "_blank")}
                                type='button'
                                className="btn btn-primary"
                              >
                                Buka Outlook / Hotmail
                              </button> */}
                             <button
                                onClick={() => (window.location.href = "mailto:")}
                                type='button'
                                className="btn btn-outline-secondary"
                              >
                                Buka Aplikasi Email Lainnya
                              </button>
                        </div>

                        <div className="text-center mt-4">
                            <Link href="/auth/signin" className="text-decoration-none text-muted small">
                                Salah memasukkan email? Coba lagi
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
