import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/api.js';
import QuestionRenderer from '../components/QuestionRenderer.jsx';
import toast from 'react-hot-toast';

export default function FormFill() {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.getForm(id)
            .then(setForm)
            .catch(() => toast.error('Form not found'));
    }, [id]);

    function setAnswer(qid, value) {
        setAnswers(prev => ({ ...prev, [qid]: value }));
    }

    async function submit() {
        if (!form) return;

        const answerList = Object.entries(answers).map(([qid, value]) => ({
            questionId: qid,
            value
        }));

        if (answerList.length === 0) {
            toast.error('Please answer at least one question.');
            return;
        }

        setLoading(true);
        try {
            await toast.promise(
                api.submitResponse(id, { answers: answerList }),
                {
                    loading: 'Submitting your response...',
                    success: 'Response submitted successfully!',
                    error: 'Failed to submit response.'
                }
            );

            // ✅ Clear answers after successful submission
            setAnswers({});
        } finally {
            setLoading(false);
        }
    }

    if (!form)
        return <p className="p-4 text-gray-600 text-center">Loading form...</p>;

    return (
        <div className="max-w-xl mx-auto p-4 sm:p-6">
            {form.headerImage && (
                <img
                    src={form.headerImage}
                    alt="Form header"
                    className="mb-4 w-full rounded object-cover"
                />
            )}
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center sm:text-left">
                {form.title}
            </h1>
            <p className="mb-6 text-gray-700 text-center sm:text-left">
                {form.description}
            </p>

            <div className="space-y-4">
                {form.questions.map(q => (
                    <QuestionRenderer
                        key={q._id}
                        question={q}
                        onAnswer={value => setAnswer(q._id, value)}
                        value={answers[q._id] || ''}
                    />
                ))}
            </div>

            <div className="mt-6 flex justify-center sm:justify-start">
                <button
                    onClick={submit}
                    disabled={loading}
                    className={`px-6 py-3 rounded text-white transition-colors duration-200 ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>
    );
}
