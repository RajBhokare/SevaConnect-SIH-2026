import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sevaconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth APIs
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  getMe: () => api.get('/auth/me')
};

// Services Catalog APIs
export const serviceCatalogApi = {
  getServices: () => api.get('/services'),
  getServiceById: (id) => api.get(`/services/${id}`)
};

// Worker Profile & Management APIs
export const workerApi = {
  getWorkers: (params) => api.get('/workers', { params }),
  getWorkerById: (id) => api.get(`/workers/${id}`),
  updateProfile: (id, data) => api.put(`/workers/${id}`, data),
  toggleAvailability: (isAvailable) => api.patch('/workers/availability', { isAvailable }),
  getDashboard: () => api.get('/workers/dashboard'),
  getWelfare: () => api.get('/workers/welfare')
};

// FairMatch Recommendations API
export const matchApi = {
  getFairMatch: (params) => api.post('/match/fairmatch', params)
};

// Booking Lifecycle APIs
export const bookingApi = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getCustomerBookings: () => api.get('/bookings/customer'),
  getWorkerBookings: () => api.get('/bookings/worker'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status })
};

// Simulated Payment APIs
export const paymentApi = {
  processPayment: (paymentData) => api.post('/payments/simulate', paymentData),
  getPaymentByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`)
};

// Rating APIs
export const ratingApi = {
  submitRating: (ratingData) => api.post('/ratings', ratingData),
  getWorkerRatings: (workerId) => api.get(`/ratings/worker/${workerId}`)
};

// AI Operational Service APIs (FastAPI proxy)
export const aiApi = {
  getForecast: (params) => axios.post('/ai/forecast', params),
  getAllocation: (params) => axios.post('/ai/allocate', params),
  getHealth: () => axios.get('/ai/health')
};

export default api;
