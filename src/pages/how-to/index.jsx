// LOKASI: src/pages/petunjuk/index.jsx (atau yang sesuai)
// VERSI BARU: Halaman petunjuk dengan format FAQ menggunakan Accordion.

import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ScrollToTopButton from '../components/ScrollToTopButton';

// Data untuk FAQ. Sangat mudah untuk menambah, mengubah, atau menghapus pertanyaan.
const faqData = [
  {
    id: 'faq1',
    question: 'Bagaimana cara mulai menggunakan SOLMATE?',
    answer: 'Sangat mudah! Anda hanya perlu mendaftar atau login. Karena kami menggunakan sistem login tanpa password (magic link), Anda cukup memasukkan alamat email Anda. Kami akan mengirimkan sebuah link ke email tersebut. Klik link itu, dan Anda akan otomatis masuk ke dalam sistem.'
  },
  {
    id: 'faq2',
    question: 'Apakah saya perlu login setiap saat?',
    answer: 'Tidak perlu. Selama Anda tidak menekan tombol "Logout", sesi login Anda akan tetap aktif di browser yang sama. Anda bisa menutup tab atau browser, dan saat membukanya kembali, Anda akan tetap dalam keadaan login.'
  },
  {
    id: 'faq3',
    question: 'Fitur apa saja yang bisa saya gunakan setelah login?',
    answer: 'Setelah login, semua fitur utama akan terbuka untuk Anda! Anda bisa mulai **membuat paket soal** di halaman "Buat Soal", melihat semua paket yang pernah Anda simpan di halaman **"Riwayat"**, dan yang terpenting, **mengerjakan latihan soal** dari paket yang sudah Anda buat.'
  },
  {
    id: 'faq4',
    question: 'Bagaimana cara membuat soal yang sesuai untuk siswa saya (misal: SD)?',
    answer: 'Kami mengerti kebutuhan Anda. Di halaman "Buat Soal", kami telah menyediakan opsi **"Jenjang Pendidikan"**. Cukup pilih jenjang yang sesuai (SD, SMP, atau SMA), dan AI kami akan secara otomatis menyesuaikan tingkat kesulitan soal agar cocok dengan kurikulum dan kemampuan siswa pada jenjang tersebut.'
  },
  {
    id: 'faq5',
    question: 'Saya tidak suka dengan salah satu soal yang dihasilkan. Apa yang harus saya lakukan?',
    answer: 'Tenang saja! Inilah keunggulan fitur "Editor Interaktif" kami. Setelah soal dibuat sebagai draf, Anda akan melihat tombol hapus dan ganti di setiap soal. Anda bisa menghapus soal yang tidak Anda suka, atau menggantinya dengan soal baru tanpa harus mengulang seluruh proses.'
  },
  {
    id: 'faq6',
    question: 'Apakah hasil kerja saya bisa diekspor?',
    answer: 'Tentu saja. Di halaman "Riwayat", setiap paket soal memiliki tombol "Cetak / Ekspor PDF" dan "Ekspor ke Word". Ini memungkinkan Anda untuk dengan mudah mencetak lembar soal untuk ujian atau membagikannya dalam format digital.'
  }
];

// Komponen untuk satu item Accordion
const FaqItem = ({ item, index }) => (
    <div className="accordion-item">
        <h2 className="accordion-header" id={`heading-${item.id}`}>
            <button 
                className={`accordion-button fs-5 fw-bold ${index !== 0 ? 'collapsed' : ''}`} 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target={`#collapse-${item.id}`} 
                aria-expanded={index === 0}
                aria-controls={`collapse-${item.id}`}
            >
                {item.question}
            </button>
        </h2>
        <div 
            id={`collapse-${item.id}`} 
            className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} 
            aria-labelledby={`heading-${item.id}`}
            data-bs-parent="#faqAccordion"
        >
            <div className="accordion-body" style={{ lineHeight: '1.7' }}>
                {item.answer}
            </div>
        </div>
    </div>
);


export default function HowToPage() {
    useEffect(() => {
        // Impor JS Bootstrap hanya di sisi klien
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            <Navbar />
            
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="display-5 fw-bold">Pusat Bantuan & Petunjuk</h1>
                    <p className="lead text-muted">
                        Temukan jawaban atas pertanyaan umum dan pelajari cara memaksimalkan SOLMATE.
                    </p>
                </div>
                
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="accordion shadow-sm" id="faqAccordion">
                            {faqData.map((item, index) => (
                                <FaqItem key={item.id} item={item} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <ScrollToTopButton />
        </div>
    );
}
