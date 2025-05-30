import { getProviders, getCsrfToken } from "next-auth/react";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function SignIn({ providers, csrfToken }) {
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
              <form method="post" action="/api/auth/signin/email" key={provider.name}>
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    required
                    placeholder="kratos@gmail.com"
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Kirim Link Masuk</button>
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
