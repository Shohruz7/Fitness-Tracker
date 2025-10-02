import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users/register/', userData),
  login: (credentials) => api.post('/users/login/', credentials),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (userData) => api.patch('/users/profile/', userData),
};

// Workout API
export const workoutAPI = {
  getWorkouts: (params = {}) => api.get('/workouts/', { params }),
  getWorkout: (id) => api.get(`/workouts/${id}/`),
  createWorkout: (workoutData) => api.post('/workouts/', workoutData),
  updateWorkout: (id, workoutData) => api.patch(`/workouts/${id}/`, workoutData),
  deleteWorkout: (id) => api.delete(`/workouts/${id}/`),
};

// Exercise API
export const exerciseAPI = {
  getExercises: (params = {}) => api.get('/exercises/', { params }),
  getExercise: (id) => api.get(`/exercises/${id}/`),
  createExercise: (exerciseData) => api.post('/exercises/', exerciseData),
  updateExercise: (id, exerciseData) => api.patch(`/exercises/${id}/`, exerciseData),
  deleteExercise: (id) => api.delete(`/exercises/${id}/`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats/'),
};

export default api;
