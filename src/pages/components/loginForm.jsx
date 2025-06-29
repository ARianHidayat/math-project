// LOKASI: src/pages/components/LoginForm.jsx
// VERSI BARU: Desain yang lebih terintegrasi dan menarik.

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
    </svg>
);

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await signIn('email', { email, redirect: false, callbackUrl: '/' });
            if (res.error) {
                setError('Gagal mengirim link. Pastikan email Anda valid.');
                setLoading(false);
            } else {
                window.location.href = res.url;
            }
        } catch (err) {
            setError('Terjadi kesalahan yang tidak terduga.');
            setLoading(false);
        }
    };

    return (
        // Menggunakan container untuk section baru ini
        <div className="container my-5 py-5 border-top">
            <div className="row justify-content-center">
                <div className="col-lg-7 text-center">
                    <h2 className="fw-bold">Siap Memulai?</h2>
                    <p className="lead text-muted mb-4">
                        Buat akun gratis atau masuk untuk menyimpan semua pekerjaan dan riwayat latihan Anda.
                    </p>

                    <form onSubmit={handleSubmit} className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                        <div className="input-group input-group-lg shadow-sm">
                            <span className="input-group-text bg-white border-end-0">
                                <EmailIcon />
                            </span>
                            <input
                                type="email"
                                className="form-control border-start-0"
                                placeholder="Masukkan alamat email Anda..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                style={{ minWidth: '250px' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                "Kirim Link Masuk"
                            )}
                        </button>
                    </form>
                    {error && <div className="text-danger mt-2 small">{error}</div>}
                </div>
            </div>
        </div>
    );
}
