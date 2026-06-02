import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Clients
  clients: {
    list: () => apiClient.get('/api/clients'),
    create: (data: any) => apiClient.post('/api/clients', data),
    get: (id: string) => apiClient.get(`/api/clients/${id}`),
    update: (id: string, data: any) => apiClient.put(`/api/clients/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/clients/${id}`),
  },
  
  // SIPs
  sips: {
    list: () => apiClient.get('/api/sips'),
    create: (data: any) => apiClient.post('/api/sips', data),
    get: (id: string) => apiClient.get(`/api/sips/${id}`),
    update: (id: string, data: any) => apiClient.put(`/api/sips/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/sips/${id}`),
  },
  
  // Portfolios
  portfolios: {
    list: () => apiClient.get('/api/portfolios'),
    get: (id: string) => apiClient.get(`/api/portfolios/${id}`),
    review: (id: string) => apiClient.post(`/api/portfolios/${id}/review`),
  },
  
  // Goals
  goals: {
    list: () => apiClient.get('/api/goals'),
    create: (data: any) => apiClient.post('/api/goals', data),
    update: (id: string, data: any) => apiClient.put(`/api/goals/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/goals/${id}`),
  },
  
  // Commissions
  commissions: {
    list: () => apiClient.get('/api/commissions'),
    get: (id: string) => apiClient.get(`/api/commissions/${id}`),
    stats: () => apiClient.get('/api/commissions/stats'),
  },
  
  // Campaigns
  campaigns: {
    list: () => apiClient.get('/api/campaigns'),
    create: (data: any) => apiClient.post('/api/campaigns', data),
    send: (id: string) => apiClient.post(`/api/campaigns/${id}/send`),
  },
  
  // Content Generation
  content: {
    generate: (data: any) => apiClient.post('/api/content/generate', data),
  },
};

export default apiClient;
