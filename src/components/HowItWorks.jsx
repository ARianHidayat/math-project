// LOKASI: src/pages/components/HowItWorks.jsx
// Komponen baru untuk menjelaskan cara kerja SOLMATE dalam beberapa langkah mudah.

import React from 'react';

// Komponen untuk satu langkah individual
const Step = ({ icon, number, title, description }) => (
  <div className="col-lg-4 text-center px-4">
    <div 
      className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary fs-2 rounded-circle mb-4" 
      style={{ width: '80px', height: '80px' }}
    >
      <span className="fw-bold">{number}</span>
    </div>
    <h3 className="fs-5 fw-bold">{title}</h3>
    <p className="text-muted">{description}</p>
  </div>
);

export default function HowItWorks() {
  return (
    <div className="bg-white py-5">
      <div className="container px-4 py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="fw-bold">Hanya 3 Langkah Mudah</h2>
            <p className="lead text-muted mb-5">
              Dari ide hingga menjadi lembar soal siap cetak dalam sekejap. Ikuti proses sederhana kami untuk hasil yang maksimal.
            </p>
          </div>
        </div>

        <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
          <Step
            number="1"
            title="Tentukan Kebutuhan"
            description="Pilih topik, tentukan jumlah soal, dan pilih jenisnya—apakah esai untuk pemahaman mendalam atau pilihan ganda untuk kuis cepat."
          />
          <Step
            number="2"
            title="Generate & Edit"
            description="Biarkan AI kami membuat draf soal untuk Anda. Tidak suka dengan satu soal? Hapus atau ganti satu per satu tanpa mengulang dari awal."
          />
          <Step
            number="3"
            title="Simpan & Ekspor"
            description="Setelah puas dengan hasilnya, simpan paket soal Anda. Riwayat Anda akan tercatat rapi dan siap untuk diekspor ke format PDF kapan saja."
          />
        </div>
      </div>
    </div>
  );
}
