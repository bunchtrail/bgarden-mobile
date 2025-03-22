import HttpClient from '@/services/HttpClient';
import { Platform } from 'react-native';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

// Базовый URL API с учетом платформы
const API_BASE_URL = Platform.select({
  ios: 'http://192.168.0.11:7254',
  android: 'http://10.0.2.2:7254',
  default: 'http://localhost:7254',
});

// Интерфейсы для запросов авторизации
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetComplete {
  token: string;
  newPassword: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  userId?: number;
}

// Создаем экземпляр HTTP клиента для авторизации
const authHttpClient = new HttpClient(API_BASE_URL, {
  Accept: 'application/json, text/plain',
  'Cache-Control': 'no-cache',
});

// API методы для авторизации
export const authApi = {
  // Метод для установки заголовка авторизации
  setAuthHeader: (token: string) => {
    authHttpClient.setDefaultHeader('Authorization', `Bearer ${token}`);
  },

  // Вход в систему
  login: async (credentials: LoginCredentials) => {
    const response = await authHttpClient.post<AuthResponse>(
      '/api/auth/login', 
      credentials as unknown as Record<string, unknown>
    );
    return response;
  },

  // Регистрация нового пользователя
  register: async (userData: RegisterCredentials) => {
    const response = await authHttpClient.post<AuthResponse>(
      '/api/auth/register', 
      userData as unknown as Record<string, unknown>
    );
    return response;
  },

  // Обновление токена
  refreshToken: async (refreshToken: string) => {
    const response = await authHttpClient.post<AuthResponse>(
      '/api/User/refresh', 
      { refreshToken } as Record<string, unknown>
    );
    return response;
  },

  // Выход из системы
  logout: async () => {
    return authHttpClient.post<void>('/api/auth/logout', {});
  },

  // Валидация токена
  validateToken: async (token: string) => {
    const response = await authHttpClient.get<TokenValidationResponse>(
      '/api/User/validate', 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  },

  // Сброс пароля
  resetPassword: async (data: PasswordResetRequest) => {
    return authHttpClient.post<{ success: boolean }>(
      '/api/auth/reset-password', 
      data as unknown as Record<string, unknown>
    );
  },

  // Завершение сброса пароля
  completeReset: async (data: PasswordResetComplete) => {
    return authHttpClient.post<{ success: boolean }>(
      '/api/auth/complete-reset', 
      data as unknown as Record<string, unknown>
    );
  },
}; 