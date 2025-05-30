import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Sudah login, lempar ke halaman utama
    } else if (status === "unauthenticated") {
      router.push("/signin"); // Belum login, lempar ke halaman input email
    }
  }, [status, router]);

  return null;
}
