import React, { useState, useEffect } from 'react';
import QuestionEditor from '../components/QuestionEditor.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import { api } from '../api/api.js';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export default function FormBuilder() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [headerImage, setHeaderImage] = useState('');
    const [headerUploadStatus, setHeaderUploadStatus] = useState('idle'); // 'idle' | 'uploading' | 'done' | 'error'
    const [questions, setQuestions] = useState([]);
    const [questionUploadStatus, setQuestionUploadStatus] = useState({}); // { [qId]: 'idle' | 'uploading' | 'done' | 'error' }

    useEffect(() => {
        async function loadForm() {
            try {
                const form = await api.getForm('someFormId'); // replace with dynamic ID
                setTitle(form.title || '');
                setDescription(form.description || '');
                setHeaderImage(form.headerImage || '');
                setQuestions(
                    (form.questions || []).map(q => ({
                        ...q,
                        _id: q._id || uuidv4(),
                        settings: q.settings || {}
                    }))
                );
            } catch (err) {
                console.error(err);
                toast.error('Failed to load form');
            }
        }
        // loadForm(); // uncomment to auto-load
    }, []);

    const createQuestionTemplate = (type = 'categorize') => {
        const base = {
            _id: uuidv4(),
            type,
            title: '',
            description: '',
            image: '',
            settings: {}
        };

        switch (type) {
            case 'categorize':
                return { ...base, settings: { categories: ['Category 1', 'Category 2'] } };
            case 'multiple_choice':
                return { ...base, settings: { options: [{ text: 'Option 1', correct: false }] } };
            case 'text':
                return { ...base, settings: { expectedAnswer: '' } };
            case 'true_false':
                return { ...base, settings: { correct: '' } };
            case 'cloze':
                return { ...base, settings: { placeholder: '' } };
            case 'comprehension':
                return { ...base, settings: { passage: '' } };
            default:
                return base;
        }
    };

    function addQuestion(type = 'categorize') {
        const newQ = createQuestionTemplate(type);
        setQuestions([...questions, newQ]);
        setQuestionUploadStatus({ ...questionUploadStatus, [newQ._id]: 'idle' });
    }

    function updateQuestion(id, updated) {
        setQuestions(questions.map(q => (q._id === id ? updated : q)));
    }

    function deleteQuestion(id) {
        setQuestions(questions.filter(q => q._id !== id));
        const updatedStatus = { ...questionUploadStatus };
        delete updatedStatus[id];
        setQuestionUploadStatus(updatedStatus);
    }

    const handleHeaderChange = (url) => {
        if (!url) {
            setHeaderImage('');
            setHeaderUploadStatus('idle');
            return;
        }

        setHeaderImage(url);
        setHeaderUploadStatus('done');
    };

    const handleQuestionImageChange = (qId, file) => {
        if (!file) {
            updateQuestion(qId, { ...questions.find(q => q._id === qId), image: '' });
            setQuestionUploadStatus({ ...questionUploadStatus, [qId]: 'idle' });
            return;
        }

        setQuestionUploadStatus({ ...questionUploadStatus, [qId]: 'uploading' });
        api.uploadImage(file)
            .then(url => {
                updateQuestion(qId, { ...questions.find(q => q._id === qId), image: url });
                setQuestionUploadStatus({ ...questionUploadStatus, [qId]: 'done' });
            })
            .catch(() => setQuestionUploadStatus({ ...questionUploadStatus, [qId]: 'error' }));
    };

    const canSubmit =
        (headerUploadStatus === 'idle' || headerUploadStatus === 'done' || headerUploadStatus === 'error') &&
        Object.values(questionUploadStatus).every(
            status => status === 'idle' || status === 'done' || status === 'error'
        );

    async function saveForm() {
        try {
            const payload = { title, description, headerImage, questions };
            await api.createForm(payload);
            toast.success('Form saved successfully!');
            setTitle('');
            setDescription('');
            setHeaderImage('');
            setHeaderUploadStatus('idle');
            setQuestions([]);
            setQuestionUploadStatus({});
        } catch (err) {
            console.error(err);
            toast.error('Failed to save form');
        }
    }

    return (
        <div className="max-w-xl sm:max-w-3xl mx-auto p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">Form Builder</h1>

            <input
                type="text"
                placeholder="Form title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
                placeholder="Form description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
            />

            <h3 className="font-semibold mt-2 mb-2">Header Image</h3>
            <ImageUploader value={headerImage} onChange={handleHeaderChange} />

            <h3 className="font-semibold mt-4 mb-2">Questions</h3>
            <div className="space-y-4">
                {questions.map((q) => (
                    <QuestionEditor
                        key={q._id}
                        question={q}
                        onChange={(updated) => updateQuestion(q._id, updated)}
                        onDelete={() => deleteQuestion(q._id)}
                        onImageChange={(file) => handleQuestionImageChange(q._id, file)}
                    />
                ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                <button onClick={() => addQuestion('categorize')} className="bg-blue-500 text-white px-3 py-2 rounded text-sm sm:text-base">
                    + Add Categorize
                </button>
                <button onClick={() => addQuestion('multiple_choice')} className="bg-purple-500 text-white px-3 py-2 rounded text-sm sm:text-base">
                    + Add Multiple Choice
                </button>
                <button onClick={() => addQuestion('text')} className="bg-teal-500 text-white px-3 py-2 rounded text-sm sm:text-base">
                    + Add Text
                </button>
                <button onClick={() => addQuestion('true_false')} className="bg-orange-500 text-white px-3 py-2 rounded text-sm sm:text-base">
                    + Add True / False
                </button>
                <button onClick={() => addQuestion('cloze')} className="bg-indigo-500 text-white px-3 py-2 rounded text-sm sm:text-base">
                    + Add Cloze
                </button>
                <button onClick={() => addQuestion('comprehension')} className="bg-pink-500 text-white px-3 py-2 rounded text-sm sm:text-base">
                    + Add Comprehension
                </button>
            </div>

            <div className="mt-6 flex justify-center sm:justify-start">
                <button
                    onClick={saveForm}
                    disabled={!canSubmit}
                    className={`px-4 py-2 rounded mt-4 text-white ${canSubmit ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    Save Form
                </button>
            </div>
        </div>
    );
}
