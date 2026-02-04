import api from './axios';

export const voicesApi = {
  // Voice Profiles
  getProfiles: async (params = {}) => {
    const response = await api.get('/api/voices/profiles/', { params });
    return response.data;
  },

  getProfile: async (id) => {
    const response = await api.get(`/api/voices/profiles/${id}/`);
    return response.data;
  },

  // Voice Clones
  getClones: async () => {
    const response = await api.get('/api/voices/clones/');
    return response.data;
  },

  getClone: async (id) => {
    const response = await api.get(`/api/voices/clones/${id}/`);
    return response.data;
  },

  createClone: async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('audio_sample', data.audioSample);

    const response = await api.post('/api/voices/clones/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteClone: async (id) => {
    const response = await api.delete(`/api/voices/clones/${id}/`);
    return response.data;
  },

  // Speech Generation
  generateSpeech: async (data) => {
    const response = await api.post('/api/voices/generate/', data);
    return response.data;
  },

  // Text Translation
  translateText: async (text, targetLanguage, sourceLanguage = 'auto') => {
    const response = await api.post('/api/voices/translate/', {
      text,
      target_language: targetLanguage,
      source_language: sourceLanguage,
    });
    return response.data;
  },

  // Speech History
  getHistory: async (params = {}) => {
    const response = await api.get('/api/voices/history/', { params });
    return response.data;
  },

  deleteHistory: async (id) => {
    const response = await api.delete(`/api/voices/history/${id}/`);
    return response.data;
  },
};

export default voicesApi;
