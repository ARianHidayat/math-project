// components/Footer.jsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-light py-4 mt-5">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <p className="mb-2 mb-md-0">&copy; {new Date().getFullYear()} SOMAT. All rights reserved.</p>
        {/* <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <Link href="/" className="text-light text-decoration-none">Beranda</Link>
          </li>
          <li className="list-inline-item">
            <Link href="/how-to" className="text-light text-decoration-none">Panduan</Link>
          </li>
          <li className="list-inline-item">
            <Link href="/tentang" className="text-light text-decoration-none">Tentang</Link>
          </li>
          <li className="list-inline-item">
            <Link href="mailto:kontak@somat.id" className="text-light text-decoration-none">Kontak</Link>
          </li>
        </ul> */}
      </div>
    </footer>
  );
}
