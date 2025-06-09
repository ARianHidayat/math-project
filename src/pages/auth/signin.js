import { getProviders, getCsrfToken } from "next-auth/react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from "next/link";
// 1. Impor useState dari React
import { useState } from "react";

export default function SignIn({ providers, csrfToken }) {
  // 2. Buat state untuk email dan pesan error
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Fungsi untuk memvalidasi email
  const validateEmail = (email) => {
    // Regex sederhana untuk validasi format email
    // Regex yang lebih ketat untuk validasi format email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;    return emailRegex.test(email);
  };

  // 3. Buat fungsi yang dijalankan saat tombol "submit" ditekan
  const handleSubmit = (e) => {
    if (!validateEmail(email)) {
      // Mencegah form untuk submit jika email tidak valid
      e.preventDefault();
      setError('Format email tidak valid. Harap periksa kembali.');
    } else {
      // Hapus pesan error jika email valid
      setError('');
      // Form akan di-submit ke action="/api/auth/signin/email"
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="card shadow" style={{ width: "24rem" }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-3">Masuk ke Akun</h5>
          <hr />
          <p className="card-text text-center">
            Silakan masukkan email Anda untuk menerima link masuk.<br />
            Link akan dikirim ke email yang kamu masukkan.
          </p>

          {providers && Object.values(providers).map((provider) =>
            provider.id === "email" ? (
              // 4. Hubungkan fungsi handleSubmit ke form
              <form method="post" action="/api/auth/signin/email" key={provider.name} onSubmit={handleSubmit}>
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={`form-control ${error ? 'is-invalid' : ''}`} // Tambah kelas 'is-invalid' jika ada error
                    required
                    placeholder="kratos@gmail.com"
                    // 5. Hubungkan input dengan state email
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // Hapus error saat pengguna mulai mengetik lagi
                      if (error) {
                        setError('');
                      }
                    }}
                  />
                  {/* 6. Tampilkan pesan error jika ada */}
                  {error && <div className="invalid-feedback">{error}</div>}
                </div>

                <div className="d-grid">
                  {/* 7. Nonaktifkan tombol jika email kosong atau ada error */}
                  <button type="submit" className="btn btn-primary" disabled={!email || !!error}>
                    Kirim Link Masuk
                  </button>
                  <Link className="text-center my-2" href="/">Kembali ke Beranda</Link>
                </div>
              </form>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: { providers, csrfToken },
  };
}