import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/router";
import Navbar from "../components/navbar";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const questionRefs = useRef({}); // Menyimpan referensi unik untuk setiap soal
  const router = useRouter();

  useEffect(() => {
  async function fetchQuestions() {
    try {
      const response = await fetch("/api/questions");
      const data = await response.json();

      // Pastikan data adalah array
      if (Array.isArray(data)) {
        setQuestions(data);

        // Inisialisasi refs untuk setiap soal
        questionRefs.current = data.reduce((acc, q) => {
          acc[q.id] = React.createRef();
          return acc;
        }, {});
      } else {
        setQuestions([]); // fallback jika bukan array
      }
    } catch (error) {
      console.error("Gagal mengambil data soal:", error);
      setQuestions([]); // fallback jika error
    } finally {
      setLoading(false);
    }
  }

  fetchQuestions();
}, []);


  const downloadPDF = (id) => {
    const input = questionRefs.current[id].current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`soal_${id}.pdf`);
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 container">
      <Navbar/>
      <h1 className="text-2xl font-bold text-center mb-6">Daftar Soal</h1>
      <button onClick={() => {
        router.push('/question-page')
      }}>buat soal</button>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada soal yang dibuat.</p>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} ref={questionRefs.current[q.id]} className="p-4 border rounded-lg shadow-md bg-white mb-3">
              <p className="font-semibold">📝 Soal:</p>
              <ReactMarkdown>{q.question}</ReactMarkdown>

              <p className="font-semibold mt-3">✅ Jawaban:</p>
              <ReactMarkdown>{q.answer}</ReactMarkdown>

              <p className="text-sm text-gray-500 mt-3">
                📅 Dibuat pada: {new Date(q.created_at).toLocaleString()}
              </p>

              <button
                onClick={() => downloadPDF(q.id)}
                className="btn btn-success"
              >
                📄 Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
