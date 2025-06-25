// LOKASI: src/pages/components/InspirationalQuote.jsx
// Komponen baru untuk menampilkan kutipan inspirasional yang berganti-ganti.

import React, { useState, useEffect } from 'react';

// Kumpulan kutipan statis tentang belajar dan matematika
const quotes = [
  {
    text: "Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia.",
    author: "Nelson Mandela"
  },
  {
    text: "Satu-satunya cara untuk belajar matematika adalah dengan mengerjakan matematika.",
    author: "Paul Halmos"
  },
  {
    text: "Jangan khawatir tentang kesulitanmu dalam matematika. Aku jamin, kesulitanku jauh lebih besar.",
    author: "Albert Einstein"
  },
  {
    text: "Hidup itu seperti bersepeda. Untuk menjaga keseimbanganmu, kamu harus terus bergerak.",
    author: "Albert Einstein"
  },
  {
    text: "Tujuan pendidikan adalah mengganti pikiran yang kosong dengan pikiran yang terbuka.",
    author: "Malcolm Forbes"
  }
];

export default function InspirationalQuote() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Atur interval untuk mengganti kutipan setiap 8 detik
    const intervalId = setInterval(() => {
      setIsFading(true); // Mulai efek fade-out

      // Tunggu 500ms (sesuai durasi transisi CSS) sebelum mengganti teks
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setIsFading(false); // Mulai efek fade-in
      }, 500);

    }, 8000); // Ganti kutipan setiap 8 detik

    // Bersihkan interval saat komponen di-unmount untuk mencegah memory leak
    return () => clearInterval(intervalId);
  }, []);

  const currentQuote = quotes[currentIndex];

  const quoteStyle = {
    transition: 'opacity 0.5s ease-in-out',
    opacity: isFading ? 0 : 1, // Atur opacity berdasarkan state isFading
  };

  return (
    <div className="container my-5">
      <div className="text-center p-5 bg-light rounded-3 shadow-sm shadow-m">
        <div style={quoteStyle}>
          <figure>
            <blockquote className="blockquote">
              <p className="mb-4 h4 fst-italic">"{currentQuote.text}"</p>
            </blockquote>
            <figcaption className="blockquote-footer">
              {currentQuote.author}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
