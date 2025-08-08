// LOKASI: src/components/TagInput.jsx
// VERSI BARU: Dengan tombol "Tambah" untuk mobile-friendly.

import React, { useState, useEffect } from 'react';

const BOOTSTRAP_COLORS = [
    { bg: 'bg-primary', text: 'text-white' },
    { bg: 'bg-success', text: 'text-white' },
    { bg: 'bg-danger', text: 'text-white' },
    { bg: 'bg-warning', text: 'text-dark' },
    { bg: 'bg-info', text: 'text-dark' },
    { bg: 'bg-secondary', text: 'text-white' },
];

const TagInput = ({ onTopicsChange }) => {
    const [topics, setTopics] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        onTopicsChange(topics.map(t => t.text));
    }, [topics, onTopicsChange]);

    // Fungsi baru yang bisa dipanggil dari Enter atau Tombol
    const addTopic = () => {
        const newTopicText = inputValue.trim();
        if (newTopicText && !topics.some(topic => topic.text === newTopicText)) {
            const nextColorClass = BOOTSTRAP_COLORS[topics.length % BOOTSTRAP_COLORS.length];
            const newTopic = { text: newTopicText, styleClass: nextColorClass };
            setTopics([...topics, newTopic]);
        }
        setInputValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Mencegah form submit
            addTopic();
        }
    };

    const removeTopic = (topicToRemove) => {
        setTopics(topics.filter(topic => topic.text !== topicToRemove));
    };

    return (
        <div className="input-group shadow-sm">
            <div 
                className="form-control d-flex align-items-center flex-wrap p-1" 
                style={{ minHeight: '48px', height: 'auto' }} // Sedikit lebih tinggi untuk sentuhan
                onClick={() => document.getElementById('tag-input-field').focus()}
            >
                {topics.map((topic, index) => (
                    <span 
                        key={index}
                        className={`badge d-flex align-items-center m-1 ${topic.styleClass.bg} ${topic.styleClass.text}`}
                        style={{ fontSize: '0.9rem', padding: '0.4em 0.8em', borderRadius: '8px' }}
                    >
                        {topic.text}
                        <span 
                            className="ms-2" 
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
                
                <input
                    id="tag-input-field"
                    type="text"
                    placeholder="Ketik topik..."
                    className='ps-2'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                        flex: '1',
                        minWidth: '150px',
                        backgroundColor: 'transparent',
                        fontSize: '1rem' // Menyesuaikan dengan form-control-lg
                    }}
                />
            </div>
            <button 
                className="btn btn-primary" 
                type="button" 
                onClick={addTopic}
                disabled={inputValue.trim() === ''}
            >
                Tambah
            </button>
        </div>
    );
};

export default TagInput;