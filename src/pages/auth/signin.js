// LOKASI: src/pages/auth/signin.js (atau file halaman login Anda)
// VERSI BARU: Dengan desain yang lebih modern dan menarik.

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

// Komponen ikon sederhana untuk input email
const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);


export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Memanggil fungsi signIn dari NextAuth untuk provider 'email'
            const res = await signIn('email', {
                email: email,
                redirect: false, // Kita handle redirect secara manual jika perlu
                callbackUrl: '/', // Arahkan ke homepage setelah login berhasil
            });

            if (res.error) {
                setError('Gagal mengirim link. Pastikan email Anda valid.');
            } else {
                // Jika berhasil, NextAuth akan mengarahkan ke halaman verify-request
                // Anda bisa menambahkan logika tambahan di sini jika perlu
                window.location.href = res.url;
            }
        } catch (err) {
            setError('Terjadi kesalahan yang tidak terduga.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* CSS untuk layout dan style tambahan */}
            <style jsx global>{`
                body {
                    background-color: #f8f9fa;
                }
            `}</style>
            <style jsx>{`
                .login-container {
                    display: flex;
                    min-height: 100vh;
                    align-items: center;
                    justify-content: center;
                }
                .login-card {
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
                    background: linear-gradient(135deg, #0d6efd, #0d61e1);
                    color: white;
                    padding: 3rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    width: 45%;
                }
                .form-section {
                    background: white;
                    padding: 3rem;
                    width: 55%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .input-group-text {
                    background-color: transparent;
                    border-right: 0;
                }
                .form-control {
                    border-left: 0;
                }
                 @media (max-width: 768px) {
                    .branding-section {
                        display: none;
                    }
                    .form-section {
                        width: 100%;
                    }
                    .login-card {
                        flex-direction: column;
                         min-height: auto;
                    }
                }
            `}</style>

            <div className="login-container p-3">
                <div className="login-card">
                    {/* Bagian Kiri (Branding) */}
                    <div className="branding-section">
                        <h1 className="fw-bold mb-3">SOLMATE</h1>
                        <p className="lead">Platform Cerdas untuk Kebutuhan Edukasi Anda.</p>
                        <p className="mt-4 opacity-75 small">Cukup masukkan email Anda sekali, dan dapatkan akses tanpa kata sandi yang aman dan praktis.</p>
                    </div>

                    {/* Bagian Kanan (Form Login) */}
                    <div className="form-section">
                        <h2 className="fw-bold mb-3">Masuk ke Akun Anda</h2>
                        <p className="text-muted mb-4">Silakan masukkan email Anda untuk menerima link masuk yang aman.</p>
                        
                        <form onSubmit={handleSubmit}>
                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="mb-4">
                                <label htmlFor="email" className="form-label">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text border-end-0 bg-white">
                                        <EmailIcon />
                                    </span>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        placeholder="contoh@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="ms-2">Mengirim...</span>
                                        </>
                                    ) : (
                                        "Kirim Link Masuk"
                                    )}
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-4">
                            <Link href="/" className="text-decoration-none text-muted small">
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

