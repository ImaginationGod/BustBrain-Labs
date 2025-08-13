import React from 'react';
import ImageUploader from './ImageUploader.jsx';
import { Trash2 } from 'lucide-react';

export default function QuestionEditor({ question, onChange, onDelete }) {
    const handleChange = (field, value) => {
        onChange({ ...question, [field]: value });
    };

    const updateSettings = (newSettings) => {
        handleChange('settings', { ...question.settings, ...newSettings });
    };

    // ----- Dynamic fields for each type -----
    const renderTypeSpecificFields = () => {
        switch (question.type) {
            case 'categorize':
                return (
                    <div>
                        <h4 className="font-semibold mt-2">Categories</h4>
                        {(question.settings.categories || []).map((cat, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-1">
                                <input
                                    type="text"
                                    value={cat}
                                    onChange={(e) => {
                                        const newCats = [...(question.settings.categories || [])];
                                        newCats[idx] = e.target.value;
                                        updateSettings({ categories: newCats });
                                    }}
                                    className="border p-1 rounded flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newCats = (question.settings.categories || []).filter((_, i) => i !== idx);
                                        updateSettings({ categories: newCats });
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => updateSettings({ categories: [...(question.settings.categories || []), ''] })}
                            className="text-blue-500 hover:underline mt-1"
                        >
                            + Add Category
                        </button>
                    </div>
                );

            case 'multiple_choice':
                return (
                    <div>
                        <h4 className="font-semibold mt-2">Options</h4>
                        {(question.settings.options || []).map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-1">
                                <input
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) => {
                                        const newOpts = [...(question.settings.options || [])];
                                        newOpts[idx] = { ...opt, text: e.target.value };
                                        updateSettings({ options: newOpts });
                                    }}
                                    className="border p-1 rounded flex-1"
                                />
                                <label className="flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        checked={opt.correct}
                                        onChange={(e) => {
                                            const newOpts = [...(question.settings.options || [])];
                                            newOpts[idx] = { ...opt, correct: e.target.checked };
                                            updateSettings({ options: newOpts });
                                        }}
                                    />
                                    Correct
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newOpts = (question.settings.options || []).filter((_, i) => i !== idx);
                                        updateSettings({ options: newOpts });
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                updateSettings({ options: [...(question.settings.options || []), { text: '', correct: false }] })
                            }
                            className="text-blue-500 hover:underline mt-1"
                        >
                            + Add Option
                        </button>
                    </div>
                );

            case 'text':
                return (
                    <div className="mt-2">
                        <label className="block font-semibold">Expected Answer (optional)</label>
                        <input
                            type="text"
                            value={question.settings.expectedAnswer || ''}
                            onChange={(e) => updateSettings({ expectedAnswer: e.target.value })}
                            className="border p-1 rounded w-full"
                        />
                    </div>
                );

            case 'true_false':
                return (
                    <div className="mt-2">
                        <label className="block font-semibold">Correct Answer</label>
                        <select
                            value={question.settings.correct || ''}
                            onChange={(e) => updateSettings({ correct: e.target.value })}
                            className="border p-1 rounded w-full"
                        >
                            <option value="">Select...</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>
                );

            case 'cloze':
                return (
                    <div className="mt-2">
                        <label className="block font-semibold">Placeholder Text</label>
                        <input
                            type="text"
                            value={question.settings.placeholder || ''}
                            onChange={(e) => updateSettings({ placeholder: e.target.value })}
                            className="border p-1 rounded w-full"
                        />
                    </div>
                );

            case 'comprehension':
                return (
                    <div className="mt-2">
                        <label className="block font-semibold">Passage</label>
                        <textarea
                            value={question.settings.passage || ''}
                            onChange={(e) => updateSettings({ passage: e.target.value })}
                            className="border p-1 rounded w-full resize-none"
                            rows={4}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="border p-3 my-2 rounded bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <select
                    value={question.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="border p-1 rounded"
                >
                    <option value="categorize">Categorize</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="text">Text</option>
                    <option value="true_false">True / False</option>
                    <option value="cloze">Cloze</option>
                    <option value="comprehension">Comprehension</option>
                </select>

                <button
                    type="button"
                    onClick={onDelete}
                    className="p-2 text-red-500 hover:text-red-700"
                    title="Delete Question"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <input
                type="text"
                placeholder="Question title"
                value={question.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="border p-1 w-full rounded mb-2"
            />

            <textarea
                placeholder="Question description"
                value={question.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="border p-1 w-full rounded mb-2"
            />

            <h4 className="font-semibold mt-2">Question Image</h4>
            <ImageUploader value={question.image} onChange={(url) => handleChange('image', url)} />

            {renderTypeSpecificFields()}
        </div>
    );
}
