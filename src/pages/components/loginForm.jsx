import {signIn} from "next-auth/react";

export default function LoginForm (){
    return (
        <>
            {<div className="card text-center shadow" style={{width:"20rem"}}>
                <div className="card-body">
                    <h5 className="card-title">Login</h5>
                    <hr />
                    <p className="card-text">Sebelum menggunakan website ini, anda harus login terlebih dahulu.</p>
                    <p className="card-text">Agar soal yang telah anda hasilkan bisa tersimpan.</p>
                    <button 
                    type="button"
                    className="btn btn-primary"
                    onClick={() => signIn()}>Login</button>
                </div>
            </div>}
        </>
    )
}