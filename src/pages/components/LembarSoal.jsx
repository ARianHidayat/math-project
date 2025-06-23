// File: src/pages/components/LembarSoal.jsx

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// BARU: Impor mesin pintar kita
import SmartQuestionDisplay from './SmartQuestionDisplay';

const LembarSoal = ({ paket, schoolName, examTitle, logo }) => {
  return (
    <div className="p-4">
      {/* Bagian Header tidak berubah */}
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
          // MODIFIKASI: Gunakan komponen pintar kita di sini
          <div key={q.id} className="mb-4" style={{ pageBreakInside: 'avoid' }}>
            <SmartQuestionDisplay question={q} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

LembarSoal.displayName = 'LembarSoal';

export default LembarSoal;