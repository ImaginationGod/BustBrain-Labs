import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
    console.warn("⚠️ VITE_API_BASE_URL is not set in your .env file");
}

const client = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const api = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await client.post(`/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.url;
    },

    createForm: async (data) => {
        const res = await client.post(`/forms`, data);
        return res.data;
    },

    getForm: async (id) => {
        const res = await client.get(`/forms/${id}`);
        return res.data;
    },

    updateForm: async (id, data) => {
        const res = await client.put(`/forms/${id}`, data);
        return res.data;
    },

    deleteForm: async (id) => {
        const res = await client.delete(`/forms/${id}`);
        return res.data;
    },

    submitResponse: async (formId, data) => {
        const res = await client.post(`/forms/${formId}/responses`, data);
        return res.data;
    },

    getResponses: async (formId) => {
        const res = await client.get(`/forms/${formId}/responses`);
        return res.data;
    },

    // ✅ NEW: fetch all forms
    getAllForms: async () => {
        const res = await client.get('/forms'); // Make sure your backend has this route
        return res.data;
    }
};
