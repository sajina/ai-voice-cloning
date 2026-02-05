import api from './axios';

export const adminApi = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/api/voices/admin/dashboard/');
    return response.data;
  },

  // Users
  getUsers: async (params = {}) => {
    const response = await api.get('/api/auth/admin/users/', { params });
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/api/auth/admin/users/${id}/`);
    return response.data;
  },

  createUser: async (data) => {
    const response = await api.post('/api/auth/admin/users/', data);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.patch(`/api/auth/admin/users/${id}/`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/auth/admin/users/${id}/`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/api/auth/admin/users/stats/');
    return response.data;
  },

  // Voice Profiles
  getVoiceProfiles: async (params = {}) => {
    const response = await api.get('/api/voices/admin/profiles/', { params });
    return response.data;
  },

  createVoiceProfile: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const response = await api.post('/api/voices/admin/profiles/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateVoiceProfile: async (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const response = await api.patch(`/api/voices/admin/profiles/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteVoiceProfile: async (id) => {
    const response = await api.delete(`/api/voices/admin/profiles/${id}/`);
    return response.data;
  },

  // Voice Clones
  getVoiceClones: async (params = {}) => {
    const response = await api.get('/api/voices/admin/clones/', { params });
    return response.data;
  },

  approveVoiceClone: async (id) => {
    const response = await api.post(`/api/voices/admin/clones/${id}/approve/`);
    return response.data;
  },

  rejectVoiceClone: async (id) => {
    const response = await api.post(`/api/voices/admin/clones/${id}/reject/`);
    return response.data;
  },

  updateVoiceClone: async (id, data) => {
    const response = await api.patch(`/api/voices/admin/clones/${id}/`, data);
    return response.data;
  },

  // Generated Speeches
  getGeneratedSpeeches: async (params = {}) => {
    const response = await api.get('/api/voices/admin/speeches/', { params });
    return response.data;
  },
};

export default adminApi;
