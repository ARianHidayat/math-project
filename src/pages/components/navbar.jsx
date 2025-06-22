// File: src/pages/components/navbar.jsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
    const router = useRouter();
    const { data: session } = useSession();

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
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
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
                        <li className="nav-item">
                            <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>

                    {session && (
                        /* --- PERBAIKAN UTAMA ADA DI BARIS DI BAWAH INI --- */
                        <div className="d-flex flex-column align-items-start flex-lg-row align-items-lg-center mt-2 mt-lg-0">
                            <span className="text-white mb-2 mb-lg-0 me-lg-3">
                                {session.user.email}
                            </span>
                            <button className="btn btn-outline-light" onClick={() => signOut()}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}