// File: src/pages/components/navbar.jsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
    const router = useRouter();
    const { data: session,status } = useSession();

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    const handleNavClick = (path) => {
        if (!session) {
            router.push('/auth/signin');
        } else {
            router.push(path);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-primary shadow" data-bs-theme="dark">
            <div className="container-fluid mx-5">
                <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <Link className="navbar-brand" href="/">
                        <span className="navbar-brand mb-0 h1">SOLMATE</span>
                    </Link>

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <button className="nav-link btn btn-link text-white" onClick={() => handleNavClick('/question-page')}>
                                Buat Soal
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link text-white" onClick={() => handleNavClick('/questions-output')}>
                                Riwayat
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link text-white" onClick={() => router.push('/how-to')}>
                                Petunjuk
                            </button>
                        </li>
                        {/* <li className="nav-item">
                            <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                        </li> */}
                    </ul>

                                 {/* === BAGIAN TAMPILAN DESKTOP (di luar menu) === */}
                    <div className="d-none d-lg-flex align-items-center">
                        {status === 'loading' ? (
                            <span className="navbar-text">Memuat...</span>
                        ) : session ? (
                            <>
                                <span className="navbar-text me-3 fw-bold text-white">
                                    {session.user.email}
                                </span>
                                <button onClick={() => signOut()} className="btn btn-outline-light">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/auth/signin" className="btn btn-light">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* === BAGIAN TAMPILAN MOBILE (di dalam menu) === */}
                    <div className="d-lg-none mt-3 border-top border-primary-subtle pt-3">
                         {status === 'loading' ? (
                            <span className="navbar-text text-white-50">Memuat...</span>
                        ) : session ? (
                            <>
                                <div className="nav-item text-white mb-2">
                                    <small>Login sebagai:</small>
                                    <div className="fw-bold">{session.user.email}</div>
                                </div>
                                <div className="d-grid">
                                    <button onClick={() => signOut()} className="btn btn-outline-light">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                             <div className="d-grid">
                                <Link href="/auth/signin" className="btn btn-light">
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}