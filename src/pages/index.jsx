import { useSession, signIn, signOut } from "next-auth/react";
// import { useSelector, useDispatch} from "react-redux";
// import {increment, decrement, reset} from "@/redux/counterSlice";
import Navbar from "./components/navbar";
import LoginForm from "./components/loginForm";
import Footer from "./components/footer";
import { useRouter } from "next/router";

import Link from 'next/link';


export default function Home() {
  // const count = useSelector((state) => state.counter.value);
  // const dispatch = useDispatch();
  const { data: session,status } = useSession();
  const router = useRouter();


  const handleNavClick = (path) => {
    if (!session) {
      router.push('/auth/signin'); // 🔁 Ganti sesuai halaman login kamu
    } else {
      router.push(path);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <Navbar/>
        <div className="container py-5">
          <div className="text-center mb-5 pb-5">
            <h1 className="display-4">Selamat Datang di SOMAT</h1>
            <p className="lead">Platform Pembuatan Soal Matematika Otomatis</p>
            <p className="text-muted">Buat soal dengan cepat, simpan, dan unduh sesuai kebutuhanmu.</p>
            <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleNavClick('/question-page')}
            >
              Buat Soal
            </button>
          </div>

          <div className="row text-center">
            <div className="col-md-4">
              <div className="card p-4 h-100 shadow">
                <h4>Buat Soal Otomatis</h4>
                <p>Gunakan AI untuk menghasilkan soal matematika dari prompt yang kamu masukkan.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 h-100 shadow">
                <h4>Riwayat Soal</h4>
                <p>Lihat kembali soal-soal yang pernah kamu buat dan simpan ke database.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 h-100 shadow">
                <h4>Unduh Soal</h4>
                <p>Unduh soal yang kamu buat dalam format PDF agar mudah dibagikan atau dicetak.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <h5 className="my-4">Belum punya akun?</h5>
            <div className="mx-auto d-flex align-items-center justify-content-center">
              <LoginForm/>
            </div> 
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div className="mx-auto">
    <Navbar/>
    <div className="container-fluid">
      <h1>ini untuk page home</h1>
      <div>
        <h1>Halo, {session.user.email}</h1>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    </div>
    <Footer/>
    </div>
  );
}
