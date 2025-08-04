// LOKASI: src/pages/petunjuk/index.jsx
// VERSI FINAL: FAQ telah diperbarui dengan contoh pengisian dan penjelasan yang lebih detail.

import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import ScrollToTopButton from '../../components/ScrollToTopButton';

// Data FAQ yang sudah diperbarui dengan contoh konkret
const faqData = [
  {
    id: 'faq1',
    question: 'Bagaimana cara mulai menggunakan SOLMATE?',
    answer: 'Sangat mudah! Cukup daftar atau login menggunakan email Anda. Kami menggunakan sistem "magic link" tanpa password. Masukkan email Anda, klik link yang kami kirim, dan Anda akan langsung masuk.'
  },
  {
    id: 'faq2',
    question: 'Bagaimana cara membuat soal yang spesifik sesuai tujuan pembelajaran?',
    answer: `Anda bisa menggunakan kombinasi "Kategori" dan "Konteks RPP". Di bagian pengaturan, kami menyediakan kategori berdasarkan kerangka pedagogis seperti Taksonomi Bloom. Contohnya, untuk membuat soal analisis:\n\n1.  **Masukkan Topik Soal**: "Statistika Dasar (Mean, Median, Modus)"\n2.  **Pilih Kategori**: "C4: Menganalisis (Analyzing)"\n3.  **Isi Konteks RPP**: "Siswa mampu menganalisis set data untuk menentukan ukuran pemusatan mana (mean, median, atau modus) yang paling tepat untuk merepresentasikan data, serta memberikan alasan."\n\nDengan input ini, AI tidak akan sekadar bertanya "Berapa mean dari data ini?", melainkan akan membuat soal kontekstual yang benar-benar menguji kemampuan analisis siswa.`
  },
  {
    id: 'faq3',
    question: 'Apa fungsi dari kolom "Konteks dari RPP"?',
    answer: 'Kolom ini adalah "pembisik" Anda untuk AI. Gunakan untuk memberikan arahan spesifik dari tujuan pembelajaran Anda. Tanpa konteks, AI mungkin hanya membuat soal definisi biasa. Dengan konteks, Anda bisa mengarahkan AI untuk membuat soal yang lebih mendalam. Contohnya, jika Anda mencentang "Sertakan Konteks dari RPP", Anda bisa memasukkan instruksi seperti "Buat soal cerita tentang diskon di pasar swalayan" untuk mendapatkan hasil yang lebih relevan.'
  },
  {
    id: 'faq4',
    question: 'Bisakah saya membuat soal Pilihan Ganda dan Esai sekaligus?',
    answer: 'Tentu saja. Di pengaturan "Tipe Soal", pilih opsi "Campuran (PG & Esai)". Setelah itu, akan muncul dua kotak input baru yang memungkinkan Anda untuk menentukan jumlah Pilihan Ganda dan jumlah Esai secara spesifik. Misalnya, Anda bisa meminta 3 soal Pilihan Ganda dan 2 soal Esai dalam satu kali pembuatan.'
  },
  {
    id: 'faq5',
    question: 'Soal yang dihasilkan kurang cocok. Apa yang bisa saya lakukan?',
    answer: 'Gunakan fitur "Editor Interaktif" kami. Setelah soal dibuat sebagai draf, setiap soal akan memiliki tombol hapus (ikon tong sampah). Klik tombol tersebut, lalu akan muncul tombol "Buat Soal Pengganti". Fitur ini akan membuat satu soal baru dengan tipe yang sama (PG atau Esai) tanpa harus mengulang seluruh proses.'
  },
  {
    id: 'faq6',
    question: 'Bagaimana cara mencetak soal atau kunci jawaban?',
    answer: 'Di halaman "Riwayat", klik ikon printer pada paket soal yang Anda inginkan. Anda akan dibawa ke halaman pratinjau. Di sana, Anda bisa mengatur kop surat (nama ujian, logo sekolah, dll.) dan memilih konten yang ingin dicetak dari dropdown: "Lembar Soal Saja", "Kunci Jawaban Saja", atau "Keduanya".'
  },
  {
    id: 'faq7',
    question: 'Bagaimana cara mengekspor soal ke PDF?',
    answer: 'Sangat mudah. Fitur "Cetak" kami sudah menjadi satu dengan "Ekspor PDF". Di halaman pratinjau, setelah semua pengaturan selesai, klik tombol "Cetak / Simpan sebagai PDF". Pada dialog cetak yang muncul, ubah pilihan "Destination" (Tujuan) dari nama printer Anda menjadi "Save as PDF", lalu klik "Save".'
  }
];

// Komponen FaqItem tidak berubah
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
                {/* Menggunakan <pre> untuk menjaga format teks dengan baris baru */}
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 'inherit' }}>{item.answer}</pre>
            </div>
        </div>
    </div>
);


export default function HowToPage() {
    useEffect(() => {
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