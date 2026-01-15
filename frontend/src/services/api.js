import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const documentsApi = {
    getAll: () => api.get('/documents'),
    getById: (id) => api.get(`/documents/${id}`),
    create: (data) => api.post('/documents', data),
    uploadPdf: (formData) => api.post('/documents/upload-pdf', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    delete: (id) => api.delete(`/documents/${id}`)
};

export const qaApi = {
    ask: (question) => api.post('/qa/ask', { question })
};

export default api;
