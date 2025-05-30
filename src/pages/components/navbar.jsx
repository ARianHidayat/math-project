import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Import bootstrap JS hanya di client
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  const handleNavClick = (path) => {
    if (!session) {
      router.push('/auth/signin'); // 🔁 Ganti sesuai halaman login kamu
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
          <a className="navbar-brand" href="/"><span className="navbar-brand mb-0 h1">SOMAT</span></a>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => handleNavClick('/question-page')}
              >
                Buat Soal
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => handleNavClick('/questions-output')}
              >
                Riwayat
              </button>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" aria-disabled="true">Disabled</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
