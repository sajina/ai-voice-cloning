import api from './axios';

export const paymentsApi = {
  // User: Submit a manual payment
  submitPayment: async (data) => {
    // data = FormData
    const response = await api.post('/api/payments/transactions/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // User: Get transaction history
  getHistory: async () => {
    const response = await api.get('/api/payments/transactions/');
    return response.data;
  },

  // Admin: Get all transactions
  getAllTransactions: async (params = {}) => {
    const response = await api.get('/api/payments/admin/transactions/', { params });
    return response.data; // might be paginated
  },

  // Admin: Approve
  approveTransaction: async (id) => {
    const response = await api.post(`/api/payments/admin/transactions/${id}/approve/`);
    return response.data;
  },

  // Admin: Reject
  rejectTransaction: async (id) => {
    const response = await api.post(`/api/payments/admin/transactions/${id}/reject/`);
    return response.data;
  },

  // Public: Get Payment Settings
  getSettings: async () => {
    const response = await api.get('/api/payments/settings/');
    return response.data; // { upi_id: '...', qr_code: '...' }
  }
};

export default paymentsApi;
