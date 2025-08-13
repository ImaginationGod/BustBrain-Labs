import React, { useState, useEffect } from 'react';

export default function QuestionRenderer({ question, onAnswer, value }) {
    const { type, title, description, image, settings = {} } = question;

    // Track multiple-choice answers
    const [mcAnswers, setMcAnswers] = useState([]);

    // Initialize local state from parent `value`
    useEffect(() => {
        if (type === 'multiple_choice') {
            if (Array.isArray(value) && value.length > 0) {
                // Set checkboxes based on parent's value
                const initial = new Array(settings.options?.length || 0).fill(false);
                value.forEach(idx => { if (idx < initial.length) initial[idx] = true; });
                setMcAnswers(initial);
            } else {
                setMcAnswers(new Array(settings.options?.length || 0).fill(false));
            }
        }
    }, [question, value]);

    const handleOptionChange = (idx, checked) => {
        const updated = [...mcAnswers];
        updated[idx] = checked;
        setMcAnswers(updated);
        onAnswer(updated.map((val, i) => (val ? i : null)).filter((v) => v !== null));
    };

    return (
        <div className="border-b pb-4 mb-4">
            {image && <img src={image} alt="" className="w-48 mb-2" />}
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>

            {type === 'text' && (
                <input
                    type="text"
                    placeholder="Your answer"
                    value={value || ''}
                    onChange={(e) => onAnswer(e.target.value)}
                    className="border p-1 mt-2 w-full"
                />
            )}

            {type === 'true_false' && (
                <select
                    value={value === undefined ? '' : value ? 'true' : 'false'}
                    onChange={(e) => onAnswer(e.target.value === 'true')}
                    className="border p-1 mt-2 w-full"
                >
                    <option value="">Select...</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            )}

            {type === 'multiple_choice' && (
                <div className="mt-2">
                    {(settings.options || []).map((opt, idx) => (
                        <label key={idx} className="flex items-center gap-2 mb-1">
                            <input
                                type="checkbox"
                                checked={mcAnswers[idx] || false}
                                onChange={(e) => handleOptionChange(idx, e.target.checked)}
                            />
                            {opt.text}
                        </label>
                    ))}
                </div>
            )}

            {type === 'categorize' && (
                <textarea
                    placeholder="Describe categorization result"
                    value={value || ''}
                    onChange={(e) => onAnswer(e.target.value)}
                    className="border p-1 mt-2 w-full"
                />
            )}
        </div>
    );
}
