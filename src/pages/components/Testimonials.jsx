// LOKASI: src/pages/components/Testimonials.jsx
// VERSI BARU: Komponen testimoni dengan auto-scroll carousel.

import React from 'react';

// Data testimoni statis telah diperbanyak
const testimonialsData = [
  {
    name: "Andi Hermawan",
    role: "Guru Matematika, SMA 123",
    quote: "SOLMATE mengubah cara saya mempersiapkan ujian. Dulu butuh berjam-jam, sekarang hanya beberapa menit. Fitur ekspor ke PDF-nya sangat membantu!",
    avatar: "https://i.pravatar.cc/150?u=andi"
  },
  {
    name: "Siti Nurhaliza",
    role: "Mahasiswa Bimbingan Belajar",
    quote: "Sebagai mahasiswa yang sering membuat soal latihan, fitur 'Ganti Soal' sangat jenius. Saya bisa menyempurnakan paket soal tanpa harus mengulang dari nol. Luar biasa!",
    avatar: "https://i.pravatar.cc/150?u=siti"
  },
  {
    name: "Budi Santoso",
    role: "Tutor Privat",
    quote: "Saya suka dengan variasi topik yang bisa digabungkan. Membuat soal ujian tryout dengan berbagai materi menjadi sangat mudah dan cepat. Highly recommended!",
    avatar: "https://i.pravatar.cc/150?u=budi"
  },
  {
    name: "Dewi Lestari",
    role: "Pengembang Kurikulum",
    quote: "Platform ini sangat intuitif. Saya bisa membuat bank soal yang terstruktur dengan cepat. Ini adalah alat yang wajib dimiliki oleh setiap institusi pendidikan.",
    avatar: "https://i.pravatar.cc/150?u=dewi"
  },
  {
    name: "Eko Prasetyo",
    role: "Siswa Kelas 12",
    quote: "Saya menggunakan SOLMATE untuk berlatih soal-soal sulit sebelum ujian. Penjelasan dan solusinya sangat mudah dipahami. Nilai saya meningkat drastis!",
    avatar: "https://i.pravatar.cc/150?u=eko"
  },
  {
    name: "Rina Amelia",
    role: "Kepala Sekolah",
    quote: "Kami menerapkan SOLMATE di sekolah kami untuk standarisasi pembuatan soal. Hasilnya, kualitas ujian kami meningkat dan beban kerja guru berkurang.",
    avatar: "https://i.pravatar.cc/150?u=rina"
  }
];

// Kartu testimoni individual. Strukturnya sama, tapi pembungkusnya diubah.
const TestimonialCard = ({ name, role, quote, avatar }) => (
  <div className="testimonial-card mx-3">
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column p-4">
        <div className="mb-4">
          <p className="fst-italic">"{quote}"</p>
        </div>
        <div className="mt-auto d-flex align-items-center">
          <img 
            src={avatar} 
            alt={`Avatar of ${name}`} 
            className="rounded-circle me-3" 
            width="50" 
            height="50"
            onError={(e) => { e.target.onerror = null; e.target.src='https://i.pravatar.cc/150'; }} // Gambar fallback
          />
          <div>
            <h6 className="fw-bold mb-0">{name}</h6>
            <small className="text-muted">{role}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  // Kita duplikasi data testimoni agar efek scroll terlihat tak terbatas (seamless)
  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <>
      {/* CSS untuk animasi carousel. Diletakkan di sini agar komponen tetap mandiri. */}
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-380px * ${testimonialsData.length}));
          }
        }
        .testimonial-carousel-container {
          overflow: hidden;
          position: relative;
        }
        .testimonial-carousel-container::before,
        .testimonial-carousel-container::after {
          content: '';
          position: absolute;
          top: 0;
          width: 10rem;
          height: 100%;
          z-index: 2;
        }
        .testimonial-carousel-container::before {
          left: 0;
          background: linear-gradient(to left, rgba(248, 249, 250, 0), #f8f9fa);
        }
        .testimonial-carousel-container::after {
          right: 0;
          background: linear-gradient(to right, rgba(248, 249, 250, 0), #f8f9fa);
        }
        .testimonial-track {
          display: flex;
          width: calc(380px * ${duplicatedTestimonials.length});
          animation: scroll 60s linear infinite;
        }
        .testimonial-track:hover {
          animation-play-state: paused;
        }
        .testimonial-card {
          width: 350px;
          flex-shrink: 0;
        }
      `}</style>

      <div className="bg-light py-5">
          <div className="container-fluid px-0">
              <div className="row justify-content-center mx-0">
                  <div className="col-lg-8 text-center mb-5">
                      <h2 className="fw-bold">Dipercaya oleh Para Pendidik</h2>
                      <p className="lead text-muted">
                          Lihat bagaimana SOLMATE membantu para guru, tutor, dan mahasiswa seperti Anda.
                      </p>
                  </div>
              </div>

              {/* Wadah untuk carousel yang bisa di-scroll */}
              <div className="testimonial-carousel-container">
                  <div className="testimonial-track">
                      {duplicatedTestimonials.map((testimonial, index) => (
                          <TestimonialCard key={index} {...testimonial} />
                      ))}
                  </div>
              </div>

          </div>
      </div>
    </>
  );
}
