import axios from 'axios';
import { JobApplication, Resume, JobInsight, ResumeSuggestion } from '@/types';

const API_BASE = '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Applications API
export const applicationsAPI = {
  getAll: () => apiClient.get<JobApplication[]>('/applications'),
  getById: (id: string) => apiClient.get<JobApplication>(`/applications/${id}`),
  create: (data: Omit<JobApplication, '_id' | 'userId' | 'lastUpdated'>) =>
    apiClient.post<JobApplication>('/applications', data),
  update: (id: string, data: Partial<JobApplication>) =>
    apiClient.put<JobApplication>(`/applications/${id}`, data),
  delete: (id: string) => apiClient.delete(`/applications/${id}`),
};

// Resumes API
export const resumesAPI = {
  getAll: () => apiClient.get<Resume[]>('/resumes'),
  getById: (id: string) => apiClient.get<Resume>(`/resumes/${id}`),
  create: (data: Omit<Resume, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Resume>('/resumes', data),
  update: (id: string, data: Partial<Resume>) =>
    apiClient.put<Resume>(`/resumes/${id}`, data),
  delete: (id: string) => apiClient.delete(`/resumes/${id}`),
};

// AI API
export const aiAPI = {
  parseJobDescription: (jobDescription: string) =>
    apiClient.post<JobInsight>('/ai/parse-job', { jobDescription }),
  getResumeSuggestions: (resumeContent: string, jobDescription: string) =>
    apiClient.post<ResumeSuggestion[]>('/ai/resume-suggestions', {
      resumeContent,
      jobDescription,
    }),
};
