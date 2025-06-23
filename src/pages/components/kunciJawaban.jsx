// File: src/pages/components/KunciJawaban.jsx

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SmartQuestionDisplay from './SmartQuestionDisplay';
import SmartAnswerDisplay from './SmartAnswerDisplay';

const KunciJawaban = ({ paket, schoolName, examTitle, logo }) => {
  return (
    <div className="p-4">
      {/* Bagian Header tidak berubah */}
      <div className="exam-header text-center border-bottom border-dark pb-3 mb-4">
        <div className="d-flex justify-content-center align-items-center">
            {logo && <img src={logo} alt="School Logo" style={{ width: '70px', height: '70px', marginRight: '20px' }} />}
            <div>
                <h4 className='mb-1'>{schoolName}</h4>
                <h5 className='mb-1'>{examTitle} - KUNCI JAWABAN</h5>
                <p className='mb-0'>Topik: {paket.topic}</p>
            </div>
        </div>
      </div>
      
      <div>
        {paket.questions.map((q, index) => (
          // Div ini sudah punya border-bottom, jadi anak-nya tidak perlu
          <div key={q.id} className="mb-4 border-bottom pb-3" style={{ pageBreakInside: 'avoid' }}>
            
            <SmartQuestionDisplay question={q} index={index} />

            <div className="ps-4 mt-3">
              {/* --- PERBAIKAN DI SINI --- */}
              {/* Sekarang kita kirim 'index' yang benar dari proses map */}
              <SmartAnswerDisplay question={q} index={index} />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

KunciJawaban.displayName = 'KunciJawaban';
export default KunciJawaban;