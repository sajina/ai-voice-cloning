import api from './axios';

export const authApi = {
  register: async (data) => {
    const response = await api.post('/api/auth/register/', data);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login/', { email, password });
    const { access, refresh, user } = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return { user, access, refresh };
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/profile/');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch('/api/auth/profile/', data);
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.put('/api/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  sendOTP: async (data) => {
    const response = await api.post('/api/auth/send-otp/', data);
    return response.data;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post('/api/auth/verify-otp/', { email, otp });
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

export default authApi;
