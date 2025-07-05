import React, { useState, useEffect } from 'react';

// BARU: Palet warna kita definisikan di sini. 
// Ini adalah warna-warna standar Bootstrap agar lebih menyatu.
const BOOTSTRAP_COLORS = [
    { bg: 'bg-primary', text: 'text-white' },
    { bg: 'bg-success', text: 'text-white' },
    { bg: 'bg-danger', text: 'text-white' },
    { bg: 'bg-warning', text: 'text-dark' }, // Warning biasanya butuh teks gelap
    { bg: 'bg-info', text: 'text-dark' },   // Info juga lebih baik dengan teks gelap
    { bg: 'bg-secondary', text: 'text-white' },
];

const TagInput = ({ onTopicsChange }) => {
    // MODIFIKASI: State sekarang menyimpan objek { text, styleClass }
    const [topics, setTopics] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        onTopicsChange(topics.map(t => t.text));
    }, [topics, onTopicsChange]);

    const handleKeyUp = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            const newTopicText = inputValue.trim();
            
            if (!topics.some(topic => topic.text === newTopicText)) {
                // Pilih kelas warna berikutnya dari palet
                const nextColorClass = BOOTSTRAP_COLORS[topics.length % BOOTSTRAP_COLORS.length];
                
                const newTopic = { text: newTopicText, styleClass: nextColorClass };
                setTopics([...topics, newTopic]);
            }
            setInputValue('');
        }
    };

    const removeTopic = (topicToRemove) => {
        setTopics(topics.filter(topic => topic.text !== topicToRemove));
    };

    // JSX yang dirombak total untuk menggunakan kelas Bootstrap sepenuhnya
    return (
        // Container utama yang meniru 'form-control' dengan kelas Bootstrap
        <div 
            className="shadow-sm form-control d-flex align-items-center flex-wrap p-1" 
            style={{ minHeight: '38px', height: 'auto' }}
            onClick={() => document.getElementById('tag-input-field').focus()}
        >
            {/* Mapping untuk setiap tag */}
            {topics.map((topic, index) => (
                <span 
                    key={index}
                    // Kelas untuk tag, termasuk warna dari palet
                    className={`badge rounded-lg shadow d-flex align-items-center m-1 ${topic.styleClass.bg} ${topic.styleClass.text}`}
                    style={{ fontSize: '0.9rem', padding: '0.4em 0.8em' }}
                >
                    {topic.text}
                    <span 
                        className="ms-2 py-1 px-2" 
                        onClick={(e) => {
                            e.stopPropagation();
                            removeTopic(topic.text);
                        }}
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        &times;
                    </span>
                </span>
            ))}
            
            {/* Input field */}
            <input
                id="tag-input-field" // Beri ID agar mudah di-fokuskan
                type="text"
                placeholder="Ketik topik, lalu enter ..."
                className='ps-3'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyUp={handleKeyUp}
                // Style untuk membuat input tidak terlihat dan mengisi sisa ruang
                style={{
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    flex: '1',
                    minWidth: '150px',
                    backgroundColor: 'transparent'
                }}
            />
        </div>
    );
};

export default TagInput;