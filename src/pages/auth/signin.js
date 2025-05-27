import { getProviders, getCsrfToken } from "next-auth/react";

export default function SignIn({ providers, csrfToken }) {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Masuk ke akun</h1>
      {providers && Object.values(providers).map((provider) =>
        provider.id === "email" ? (
          <form method="post" action="/api/auth/signin/email" key={provider.name}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <label>
              Email: <input type="email" name="email" required />
            </label>
            <button type="submit">Kirim Link Masuk</button>
          </form>
        ) : null
      )}
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
