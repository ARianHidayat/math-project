import 'bootstrap/dist/css/bootstrap.min.css';

// pages/auth/verify-request.tsx
export default function VerifyRequestPage() {
  return (
    <div className='min-vh-100 d-flex align-items-center justify-content-center' style={{ textAlign: "center"}}>
      <div className='border border-3 shadow rounded-3 p-3'>
        <h1>📧 Cek Email Kamu</h1>
        <p>Kami telah mengirimkan tautan untuk login ke email kamu.</p>
        <p>Silakan buka dan klik link tersebut untuk masuk.</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.open("https://mail.google.com/mail/u/0/#inbox", "_blank")}
            type='button'
            className=" btn btn-primary shadow-sm m-2 px-4 py-2 rounded transition"
          >
            Buka Gmail di Browser 🌐
          </button>
          <button
            onClick={() => (window.location.href = "mailto:")}
            type='button'
            className="btn btn-success shadow-sm px-4 py-2 rounded transition"
          >
            Buka Aplikasi Email 📱
          </button>
        </div>
      </div>
    </div>
  );
}
