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
  },
  {
    text: "Belajar tidak akan pernah mengkhianati hasil.",
    author: "Anonim"
  },
  {
    text: "Jika kamu lelah belajar, ingatlah tujuanmu.",
    author: "Anonim"
  },
  {
    text: "Kesuksesan adalah hasil dari kerja keras, ketekunan, dan belajar dari kegagalan.",
    author: "Colin Powell"
  },
  {
    text: "Logika akan membawa kamu dari A ke B. Imajinasi akan membawa kamu ke mana saja.",
    author: "Albert Einstein"
  },
  {
    text: "Matematika adalah bahasa di mana Tuhan menulis alam semesta.",
    author: "Galileo Galilei"
  },
  {
    text: "Setiap orang jenius dalam bidangnya. Tapi jika kamu menilai ikan dari kemampuannya memanjat pohon, ia akan mengira dirinya bodoh seumur hidup.",
    author: "Albert Einstein"
  },
  {
    text: "Pendidikan bukanlah persiapan untuk hidup. Pendidikan adalah hidup itu sendiri.",
    author: "John Dewey"
  },
  {
    text: "Bukan kecerdasan yang membuat seseorang hebat dalam matematika, tapi ketekunan dan rasa ingin tahu.",
    author: "Anonim"
  },
  {
    text: "Kesalahan adalah bukti bahwa kamu sedang mencoba.",
    author: "Anonim"
  },
  {
    text: "Belajar hari ini, memimpin besok.",
    author: "Anonim"
  },
  {
    text: "Orang bijak belajar ketika mereka bisa. Orang bodoh belajar ketika mereka harus.",
    author: "Arthur Wellesley"
  },
  {
    text: "Pendidikan bukanlah mengisi ember, tapi menyalakan api.",
    author: "William Butler Yeats"
  },
  {
    text: "Akar pendidikan itu pahit, tapi buahnya manis.",
    author: "Aristoteles"
  },
  {
    text: "Kebodohan adalah musuh utama dari kebebasan.",
    author: "Thomas Jefferson"
  },
  {
    text: "Berpikirlah seperti orang bijak, tapi berkomunikasilah dalam bahasa orang biasa.",
    author: "Aristoteles"
  },
  {
    text: "Tujuan utama dari pendidikan adalah menciptakan manusia yang mampu berpikir sendiri.",
    author: "Jean Piaget"
  },
  {
    text: "Pikiran adalah segala-galanya. Apa yang kamu pikirkan, itulah kamu.",
    author: "Buddha"
  },
  {
    text: "Ilmu tanpa agama adalah lumpuh. Agama tanpa ilmu adalah buta.",
    author: "Albert Einstein"
  },
  {
    text: "Seseorang tidak belajar di sekolah. Hidup adalah sekolah sejati.",
    author: "Albert Einstein"
  },
  {
    text: "Siapa yang membuka sekolah, akan menutup penjara.",
    author: "Victor Hugo"
  },
  {
    text: "Bukan kita yang lemah, hanya saja kita belum tahu cara yang benar untuk belajar.",
    author: "Socrates"
  },
  {
    text: "Pendidikan adalah penemuan progresif tentang ketidaktahuan kita.",
    author: "Will Durant"
  },
  {
    text: "Orang bodoh berpikir dirinya bijak. Orang bijak tahu dirinya bodoh.",
    author: "William Shakespeare"
  },
  {
    text: "Matematika adalah seni untuk memberikan nama yang sama kepada hal-hal yang berbeda.",
    author: "Henri Poincaré"
  },
  {
    text: "Tidak ada yang lebih praktis daripada teori yang bagus.",
    author: "Kurt Lewin"
  },
  {
    text: "Belajar tanpa berpikir sia-sia, berpikir tanpa belajar berbahaya.",
    author: "Confucius"
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
