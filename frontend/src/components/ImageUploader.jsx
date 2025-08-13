import React, { useState } from 'react';
import { api } from '../api/api.js';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function ImageUploader({ value, onChange }) {
    const [loading, setLoading] = useState(false);

    async function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            const url = await api.uploadImage(file);
            onChange(url);
            toast.success('Image uploaded successfully');
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || 'Image upload failed');
        } finally {
            setLoading(false);
        }
    }

    const handleRemove = () => {
        onChange('');
        toast('Image removed');
    };

    return (
        <div className="flex flex-col gap-2">
            {value && (
                <div className="relative">
                    <img src={value} alt="Preview" className="mb-2 max-h-40 rounded" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                        title="Remove Image"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
            <input type="file" onChange={handleFileChange} disabled={loading} />
            {loading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>
    );
}
