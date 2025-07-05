// LOKASI: src/pages/components/ScrollToTopButton.jsx
// Komponen baru untuk tombol "Scroll to Top".

import React, { useState, useEffect } from 'react';

// Ikon panah ke atas
const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-up-short" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
    </svg>
);


export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Fungsi untuk menampilkan tombol saat scroll
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) { // Tombol muncul setelah scroll 300px
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Fungsi untuk melakukan scroll ke atas dengan animasi halus
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        // Membersihkan event listener saat komponen tidak lagi digunakan
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const buttonStyle = {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1050,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.3s, visibility 0.3s',
        borderRadius: '50%', // Membuat tombol menjadi bulat
        width: '50px',
        height: '50px'
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className="btn btn-success d-flex align-items-center justify-content-center shadow-lg"
            style={buttonStyle}
            aria-label="Kembali ke atas"
        >
            <ArrowUpIcon />
        </button>
    );
}
