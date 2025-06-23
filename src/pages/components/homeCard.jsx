// File: components/HomeCard.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
// BARU: Impor ikon-ikon baru yang kita butuhkan
import { 
    BsPencilSquare, 
    BsClockHistory, 
    BsDownload, 
    BsListCheck, 
    BsShuffle, 
    BsEnvelopePaperHeart 
} from "react-icons/bs";

export default function HomeCard() { 
    return (
        // Container utama kita tetap menggunakan 'row'
        <div className="row justify-content-center text-center">
            
            {/* Kartu 1: Buat Soal (Tetap) */}
            <div className="col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                        <BsPencilSquare size={40} className="text-primary mb-3" />
                        <h5 className="card-title fw-bold">Buat Soal Cepat</h5>
                        <p className="card-text">Hasilkan soal matematika dari berbagai topik hanya dengan beberapa kali klik.</p>
                    </div>
                </div>
            </div>

            {/* BARU: Kartu 2 - Tipe Soal Bervariasi */}
            <div className="col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                        <BsListCheck size={40} className="text-primary mb-3" />
                        <h5 className="card-title fw-bold">Beragam Tipe Soal</h5>
                        <p className="card-text">Pilih antara soal esai untuk pemahaman mendalam atau pilihan ganda untuk kuis cepat.</p>
                    </div>
                </div>
            </div>

            {/* BARU: Kartu 3 - Editor Interaktif */}
            <div className="col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                        <BsShuffle size={40} className="text-primary mb-3" />
                        <h5 className="card-title fw-bold">Editor Soal Interaktif</h5>
                        <p className="card-text">Tidak suka dengan satu soal? Ganti soal tersebut satu per satu tanpa mengulang dari awal.</p>
                    </div>
                </div>
            </div>

            {/* Kartu 4: Riwayat Soal (Tetap) */}
            <div className="col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                        <BsClockHistory size={40} className="text-primary mb-3" />
                        <h5 className="card-title fw-bold">Riwayat Soal</h5>
                        <p className="card-text">Semua paket soal yang Anda simpan akan tercatat rapi dan bisa diakses kapan saja.</p>
                    </div>
                </div>
            </div>
            
            {/* Kartu 5: Unduh & Ekspor (Tetap) */}
            <div className="col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                        <BsDownload size={40} className="text-primary mb-3" />
                        <h5 className="card-title fw-bold">Unduh & Cetak</h5>
                        <p className="card-text">Ekspor hasil kerja Anda ke dalam format PDF yang siap untuk dicetak dan dibagikan.</p>
                    </div>
                </div>
            </div>

            {/* BARU: Kartu 6 - Login Tanpa Password */}
            <div className="col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                        <BsEnvelopePaperHeart size={40} className="text-primary mb-3" />
                        <h5 className="card-title fw-bold">Login Tanpa Password</h5>
                        <p className="card-text">Masuk dengan mudah menggunakan Magic Link yang dikirim ke email Anda. Aman dan praktis.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}