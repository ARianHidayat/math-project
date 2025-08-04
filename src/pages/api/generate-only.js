// LOKASI: src/pages/api/generate-only.js
// VERSI FINAL: Mendukung jumlah soal campuran yang spesifik.

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});

// Fungsi ini tidak perlu diubah sama sekali
// Ganti fungsi getDifficultyContext yang lama dengan yang ini:
const getDifficultyContext = (difficulty) => {
    switch (difficulty) {
        // Jenjang Pendidikan (Tetap Sama)
        case 'sd':
            return 'Soal harus sangat sederhana, cocok untuk anak Sekolah Dasar. Gunakan operasi dasar seperti penjumlahan, pengurangan, dan perkalian satu atau dua digit.';
        case 'smp':
            return 'Soal harus memiliki tingkat kesulitan menengah, cocok untuk siswa SMP. Boleh menyertakan aljabar dasar, geometri sederhana, dan pecahan.';

        // Taksonomi Bloom
        case 'bloom_c1':
            return 'Soal harus menguji kemampuan Mengingat (Taksonomi Bloom C1). Fokus pada pertanyaan yang meminta siswa untuk menyebutkan kembali fakta, istilah, atau konsep dasar.';
        case 'bloom_c2':
            return 'Soal harus menguji kemampuan Memahami (Taksonomi Bloom C2). Minta siswa untuk menjelaskan ide atau konsep, menginterpretasikan, atau meringkas informasi.';
        case 'bloom_c3':
            return 'Soal harus menguji kemampuan Menerapkan (Taksonomi Bloom C3). Minta siswa untuk menggunakan informasi atau konsep dalam situasi baru atau nyata. Gunakan soal cerita praktis.';
        case 'bloom_c4':
            return 'Soal harus menguji kemampuan Menganalisis (Taksonomi Bloom C4). Minta siswa untuk memecah informasi menjadi bagian-bagian, mengidentifikasi pola, atau mengenali hubungan sebab-akibat. Hindari simbol matematika yang rumit.';
        case 'bloom_c5':
            return 'Soal harus menguji kemampuan Mengevaluasi (Taksonomi Bloom C5). Minta siswa untuk memberikan penilaian, argumen, atau keputusan berdasarkan kriteria dan standar. Buat sebuah skenario untuk dinilai.';
        case 'bloom_c6':
            return 'Soal harus menguji kemampuan Mencipta (Taksonomi Bloom C6). Minta siswa untuk menghasilkan ide baru atau produk orisinal, misalnya dengan meminta mereka merancang sebuah masalah matematika sederhana berdasarkan data yang diberikan.';

        // Kerangka Lain
        case 'gagne_recall':
            return "Menurut Gagne's Nine Events, soal ini harus bertujuan untuk menstimulasi ingatan akan pembelajaran sebelumnya (event 3). Buat pertanyaan yang menghubungkan topik saat ini dengan konsep dasar yang seharusnya sudah dikuasai siswa.";
        case 'gagne_elicit':
            return "Menurut Gagne's Nine Events, soal ini harus bertujuan untuk mendorong kinerja siswa (event 7). Buat pertanyaan praktik langsung yang memungkinkan siswa menerapkan apa yang baru saja mereka pelajari dari topik yang diberikan.";
        case 'vak_visual':
            return "Buat soal yang cocok untuk gaya belajar Visual. **Deskripsikan sebuah skenario, pola, atau bentuk geometris sederhana HANYA DENGAN TEKS**. Siswa harus bisa memvisualisasikan masalah dari deskripsi teks untuk menyelesaikannya. **Jangan membuat gambar atau diagram.**";
        
        default:
            return '';
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user || !session.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // --- BAGIAN YANG DIPERBARUI 1: Ambil parameter baru dari body ---
        const { topic, topics, numberOfQuestions, questionType, difficulty, numMultipleChoice, numEssay, rppContext } = req.body;

        if (!topic && (!Array.isArray(topics) || topics.length === 0)) {
            return res.status(400).json({ error: "Topik tidak boleh kosong" });
        }

        const contextualInstruction = getDifficultyContext(difficulty);
        const isMultiTopic = topics && topics.length > 0;
        const topicString = isMultiTopic ? `topik-topik berikut: ${topics.join(', ')}` : `topik "${topic}"`;
        
        let mainInstruction;
        let formatInstruction;

        // --- BAGIAN YANG DIPERBARUI 2: Logika Prompt yang Lebih Cerdas ---
        if (questionType === 'mixed') {
            const pgCount = numMultipleChoice || 0;
            const essayCount = numEssay || 0;
            const total = pgCount + essayCount;

            if (total === 0) {
                return res.status(400).json({ error: "Jumlah total soal tidak boleh nol." });
            }

            mainInstruction = `Buat total ${total} soal matematika campuran dengan rincian: ${pgCount} soal Pilihan Ganda dan ${essayCount} soal Esai tentang ${topicString}.`;
            formatInstruction = `Format respons dalam array JSON yang valid. Untuk soal Pilihan Ganda, objek harus berisi: "questionText", "optionA", "optionB", "optionC", "optionD", "correctAnswer", dan "solution". Untuk soal Esai, objek harus berisi: "questionText", "correctAnswer", dan "solution".`;
        } else {
            // Logika untuk tipe soal non-campuran (kode Anda yang lama, tidak berubah)
            const count = numberOfQuestions || 5;
            mainInstruction = `Buat ${count} soal matematika tentang ${topicString}.`;

            if (questionType === 'multiple_choice') {
                formatInstruction = `Jenis soal harus Pilihan Ganda. Format respons dalam array JSON yang valid, setiap objek berisi: "questionText", "optionA", "optionB", "optionC", "optionD", "correctAnswer" (HANYA HURUF), dan "solution". Pastikan setiap soal memiliki 4 pilihan.`;
            } else { // essay
                formatInstruction = `Jenis soal harus Esai. Format respons dalam array JSON yang valid dengan properti "questionText", "correctAnswer", dan "solution".`;
            }
        }
        // --- TAMBAHKAN BLOK KODE DI BAWAH INI ---
        let rppInstruction = '';
        if (rppContext && rppContext.trim() !== '') {
            rppInstruction = `Soal yang dibuat HARUS sesuai dan relevan dengan konteks Rencana Pelaksanaan Pembelajaran (RPP) berikut: "${rppContext}"`;
        }
        
        // --- UBAH BARIS DI BAWAH INI ---
        // Gabungkan semua instruksi, termasuk RPP
        const prompt = `${mainInstruction}\n${formatInstruction}\n${rppInstruction}\nPENTING: ${contextualInstruction}`;
        
        console.log("Mengirim prompt ke AI:", prompt);
        const result = await model.generateContent(prompt);
        const questionsData = JSON.parse(result.response.text());

        if (!Array.isArray(questionsData)) {
            throw new Error("Format respons dari AI tidak valid.");
        }
        
        return res.status(200).json(questionsData);

    } catch (error) {
        console.error("❌ Terjadi kesalahan di API generate-only:", error);
        const errorMessage = error.message || "Gagal generate soal.";
        return res.status(500).json({ error: errorMessage });
    }
}