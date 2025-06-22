// File: src/pages/components/KunciJawaban.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';

const KunciJawaban = ({ paket, schoolName, examTitle, logo }) => {
  return (
    <div className="p-4">
      {/* Bagian Header Ujian */}
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
          <div key={q.id} className="mb-4 border-bottom pb-3" style={{ pageBreakInside: 'avoid' }}>
            <div className="d-flex align-items-start mb-2">
              <span className="me-2 fw-bold">{index + 1}.</span>
              <div className="w-100">
                <ReactMarkdown>{q.question}</ReactMarkdown>
              </div>
            </div>
            <div className="ps-4">
                <h6 className="font-semibold">Langkah Penyelesaian:</h6>
                <div className="p-3 bg-secondary-subtle rounded mb-2">
                    <ReactMarkdown>{q.solution}</ReactMarkdown>
                </div>
                <h6 className="font-semibold">Jawaban Akhir:</h6>
                <div className="p-3 bg-success-subtle rounded">
                    <ReactMarkdown>{q.answer}</ReactMarkdown>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

KunciJawaban.displayName = 'KunciJawaban';

export default KunciJawaban;