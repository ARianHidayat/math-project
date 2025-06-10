// File: src/pages/components/LembarUjian.jsx

import React from 'react'; // forwardRef tidak dibutuhkan lagi
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';

// Ini sekarang menjadi komponen fungsional biasa
const LembarUjian = ({ paket, schoolName, examTitle, logo }) => {
  return (
    // ref tidak dibutuhkan lagi di sini
    <div className="p-4">
      {/* Bagian Header Ujian */}
      <div className="exam-header text-center border-bottom border-dark pb-3 mb-4">
        <div className="d-flex justify-content-center align-items-center">
            {logo && <img src={logo} alt="School Logo" style={{ width: '70px', height: '70px', marginRight: '20px' }} />}
            <div>
                <h4 className='mb-1'>{schoolName}</h4>
                <h5 className='mb-1'>{examTitle}</h5>
                <p className='mb-0'>Topik: {paket.topic}</p>
            </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between mb-4">
        <p><strong>Nama:</strong> ........................................</p>
        <p><strong>Kelas:</strong> ........................................</p>
      </div>

      <div>
        <p className="fw-bold">Jawablah pertanyaan-pertanyaan di bawah ini dengan benar!</p>
        {paket.questions.map((q, index) => (
          <div key={q.id} className="mb-4" style={{ pageBreakInside: 'avoid' }}>
            <div className="d-flex align-items-start">
              <span className="me-2">{index + 1}.</span>
              <div className="w-100">
                <ReactMarkdown>{q.question}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

LembarUjian.displayName = 'LembarUjian';

export default LembarUjian;