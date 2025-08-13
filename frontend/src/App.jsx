import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import FormBuilder from './pages/FormBuilder.jsx';
import FormFill from './pages/FormFill.jsx';
import { Toaster } from 'react-hot-toast';
import { api } from './api/api.js';

function FormNavDropdown({ forms, selectedForm, setSelectedForm }) {
    const navigate = useNavigate();

    const handleChange = (e) => {
        const formId = e.target.value;
        setSelectedForm(formId);
        navigate(`/fill/${formId}`);
    };

    return (
        <select
            value={selectedForm}
            onChange={handleChange}
            className="border rounded p-1"
        >
            <option value="" disabled>
                Select a form to fill
            </option>
            {forms.map(form => (
                <option key={form._id} value={form._id}>
                    {form.title}
                </option>
            ))}
        </select>
    );
}

export default function App() {
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState("");

    const fetchForms = async () => {
        try {
            const data = await api.getAllForms();
            setForms(data);
        } catch (err) {
            console.error('Failed to fetch forms', err);
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    return (
        <BrowserRouter>
            {/* Navigation */}
            <nav className="bg-white shadow p-4 flex flex-wrap gap-6 items-center">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `font-semibold ${isActive ? 'text-blue-800' : 'text-blue-600'}`
                    }
                >
                    Form Builder
                </NavLink>

                <FormNavDropdown
                    forms={forms}
                    selectedForm={selectedForm}
                    setSelectedForm={setSelectedForm}
                />
            </nav>

            {/* Main content */}
            <div className="p-4 max-w-3xl mx-auto">
                <Routes>
                    <Route
                        path="/"
                        element={<FormBuilder onFormSaved={fetchForms} />}
                    />
                    <Route path="/fill/:id" element={<FormFill />} />
                </Routes>
            </div>

            {/* Toast notifications */}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: { fontSize: '0.9rem' },
                    success: { style: { background: 'green', color: 'white' } },
                    error: { style: { background: 'red', color: 'white' } },
                }}
            />
        </BrowserRouter>
    );
}
