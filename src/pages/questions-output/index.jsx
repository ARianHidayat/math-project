// LOKASI: src/pages/questions-output/index.jsx
// VERSI DIPERBAIKI: Struktur tombol hapus telah diperbaiki untuk menghindari nesting error.

import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSession, signIn } from "next-auth/react";
import Link from 'next/link';
import { BsCalendarDate, BsHash, BsTrash } from "react-icons/bs";

import Navbar from "../../components/navbar";
import PaketSoalCard from "../../components/PaketSoalCard";
import ScrollToTopButton from "../../components/ScrollToTopButton";

const DeleteConfirmationModal = ({ show, onHide, onConfirm, isDeleting, paketTopic }) => {
    if (!show) return null;
    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header"><h5 className="modal-title">Konfirmasi Hapus</h5><button type="button" className="btn-close" onClick={onHide} disabled={isDeleting}></button></div>
                    <div className="modal-body">
                        <p>Apakah Anda yakin ingin menghapus paket soal dengan topik:</p><p className="fw-bold">"{paketTopic}"?</p>
                        <p className="text-danger small">Tindakan ini tidak dapat diurungkan.</p>
                    </div>
                    <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onHide} disabled={isDeleting}>Batal</button><button type="button" className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>{isDeleting ? 'Menghapus...' : 'Ya, Hapus'}</button></div>
                </div>
            </div>
        </div>
    );
};

const SummaryIcon = ({ icon: Icon, text }) => (
    <div className="d-flex align-items-center text-muted me-3"><Icon className="me-2" size={16} /><small>{text}</small></div>
);

export default function QuestionsOutputPage() {
    const { data: session, status } = useSession();
    const [paketSoalList, setPaketSoalList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [paketToDelete, setPaketToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const fetchPaketSoal = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/questions");
            if (!response.ok) throw new Error("Gagal mengambil data");
            const data = await response.json();
            setPaketSoalList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal mengambil data paket soal:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
        if (status !== "loading" && status === "unauthenticated") {
            signIn();
            return;
        }
        if (status === "authenticated") {
            fetchPaketSoal();
        }
    }, [status]);

    const handleOpenDeleteModal = (paket) => {
        setPaketToDelete(paket);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setPaketToDelete(null);
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = async () => {
        if (!paketToDelete) return;
        setIsDeleting(true);
        try {
            await fetch(`/api/paket/${paketToDelete.id}`, { method: 'DELETE' });
            setPaketSoalList(prevList => prevList.filter(p => p.id !== paketToDelete.id));
            handleCloseDeleteModal();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (status === "loading" || (status === "authenticated" && loading)) {
        return <div className="d-flex justify-content-center align-items-center vh-100"><div>Memuat Riwayat Soal...</div></div>;
    }
    if (status === "unauthenticated") return null;

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            <Navbar />
            <div className="container py-5">
                <div className="text-center mb-5"><h1 className="display-6 fw-bold">Riwayat Anda</h1><p className="lead text-muted">Semua paket soal Anda tersimpan di sini.</p></div>
                {paketSoalList.length === 0 ? (
                    <div className="text-center card p-5 shadow-sm border-0">
                        <h2 className="h4 fw-bold">Riwayat Masih Kosong</h2><p className="text-muted mb-4">Mulai buat paket soal dan riwayatnya akan muncul di sini.</p>
                        <div className="d-flex justify-content-center"><Link href="/question-page" className="btn btn-primary btn-lg">🚀 Buat Paket Soal Pertama Anda</Link></div>
                    </div>
                ) : (
                    <div className="accordion shadow-sm" id="riwayatAccordion">
                        {paketSoalList.map((paket, index) => (
                            <div className="accordion-item" key={paket.id}>
                                <h2 className="accordion-header d-flex align-items-center" id={`heading-${paket.id}`}>
                                    <button className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${paket.id}`} aria-expanded={index === 0} aria-controls={`collapse-${paket.id}`} style={{ flexGrow: 1 }}>
                                        <div>
                                            <span className="fw-bolder fs-5 text-dark">{paket.topic}</span>
                                            <div className="d-flex flex-wrap mt-2">
                                                <SummaryIcon icon={BsCalendarDate} text={new Date(paket.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
                                                <SummaryIcon icon={BsHash} text={`${paket.questions.length} Soal`} />
                                            </div>
                                        </div>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger ms-2 me-3" onClick={() => handleOpenDeleteModal(paket)} title="Hapus Paket Soal">
                                        <BsTrash />
                                    </button>
                                </h2>
                                <div id={`collapse-${paket.id}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} aria-labelledby={`heading-${paket.id}`} data-bs-parent="#riwayatAccordion">
                                    <div className="accordion-body p-0"><PaketSoalCard paket={paket} /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ScrollToTopButton/>
            <DeleteConfirmationModal show={showDeleteModal} onHide={handleCloseDeleteModal} onConfirm={handleConfirmDelete} isDeleting={isDeleting} paketTopic={paketToDelete?.topic} />
        </div>
    );
}
