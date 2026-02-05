import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  user?: any;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<any>> {
    const response = await api.post('/auth/login', credentials);
    const { success, user } = response.data;
    
    if (success) {
      // Store token if provided by the backend
      const token = response.data.token || response.data.access_token;
      if (token) {
        localStorage.setItem('authToken', token);
      }
    }
    
    return response.data;
  },

  async register(data: RegisterData): Promise<ApiResponse<any>> {
    const response = await api.post('/auth/register', data);
    const { success, user } = response.data;
    
    if (success) {
      // Store token if provided by the backend
      const token = response.data.token || response.data.access_token;
      if (token) {
        localStorage.setItem('authToken', token);
      }
    }
    
    return response.data;
  },

  async getCurrentUser(): Promise<ApiResponse<any>> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on the server, we should clear the local token
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
    }
  }
};