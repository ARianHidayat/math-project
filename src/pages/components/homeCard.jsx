// LOKASI: src/pages/components/HomeCard.jsx
// VERSI FINAL: Menggunakan React State untuk efek hover yang lebih andal dan konten yang diperbarui.

import React, { useState } from 'react'; // Impor useState
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
    BsPencilSquare, 
    BsClockHistory, 
    BsDownload, 
    BsListCheck, 
    BsShuffle, 
    BsEnvelopePaperHeart,
    BsClipboardCheck // Ikon baru untuk fitur latihan soal
} from "react-icons/bs";

// Data untuk setiap kartu fitur, dengan tambahan fitur baru.
const features = [
    {
        icon: <BsPencilSquare size={40} className="text-primary" />,
        title: "Buat Soal Cepat",
        description: "Hasilkan soal matematika dari berbagai topik hanya dengan beberapa kali klik."
    },
    {
        icon: <BsListCheck size={40} className="text-primary" />,
        title: "Beragam Tipe Soal",
        description: "Pilih antara soal esai untuk pemahaman mendalam atau pilihan ganda untuk kuis cepat."
    },
    {
        icon: <BsShuffle size={40} className="text-primary" />,
        title: "Editor Soal Interaktif",
        description: "Tidak suka dengan satu soal? Ganti soal tersebut satu per satu tanpa mengulang dari awal."
    },
    { // KARTU BARU YANG ANDA MINTA
        icon: <BsClipboardCheck size={40} className="text-primary" />,
        title: "Latihan Soal Interaktif",
        description: "Uji pemahaman Anda dengan mengerjakan soal yang telah dibuat, lengkap dengan skor dan pembahasan."
    },
    {
        icon: <BsClockHistory size={40} className="text-primary" />,
        title: "Riwayat Soal & Latihan",
        description: "Semua paket soal dan hasil latihan Anda akan tercatat rapi dan bisa diakses kapan saja."
    },
    {
        icon: <BsDownload size={40} className="text-primary" />,
        title: "Unduh & Cetak",
        description: "Ekspor hasil kerja Anda ke dalam format PDF yang siap untuk dicetak dan dibagikan."
    }
];

// Komponen untuk satu kartu fitur, sekarang dengan state untuk hover
const FeatureCard = ({ icon, title, description }) => {
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle = {
        border: '1px solid #e9ecef',
        borderRadius: '0.75rem',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        backgroundColor: isHovered ? '#0d6efd' : '#fff',
        color: isHovered ? '#fff' : '#212529',
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 24px rgba(0, 0, 0, 0.1)' : 'none'
    };
    
    const iconStyle = {
        color: isHovered ? '#fff' : '#0d6efd',
        transition: 'color 0.3s ease-in-out'
    };

    const textMutedStyle = {
      color: isHovered ? 'rgba(255, 255, 255, 0.75)' : '#6c757d', // Warna lebih terang saat hover
    };

    return (
        <div className="col-lg-4 col-md-6 mb-4">
            <div 
                className="card h-100 text-center"
                style={cardStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                    {/* Mengkloning ikon untuk menerapkan style dinamis */}
                    {React.cloneElement(icon, { style: iconStyle })}
                    <h5 className="card-title fw-bold mt-3">{title}</h5>
                    <p className="card-text" style={textMutedStyle}>{description}</p>
                </div>
            </div>
        </div>
    );
};

export default function HomeCard() { 
    return (
        <div className="row justify-content-center">
            {features.map((feature, index) => (
                <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                />
            ))}
        </div>
    );
}
