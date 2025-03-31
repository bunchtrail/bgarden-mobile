import HttpClient from './HttpClient';
import { Platform } from 'react-native';
import { authApi } from '../modules/auth/services/authApi';
import { plantsApi } from '../modules/plants/services/plantsApi';
import Constants from 'expo-constants';

// Получаем настройки из Expo Constants
const expoPrevHost = Constants?.manifest?.extra?.host;
const expoHost = Constants?.expoConfig?.extra?.host;
const isTunnel = (expoPrevHost === 'tunnel' || expoHost === 'tunnel');

// Базовый URL API с учетом платформы и режима туннеля
const API_BASE_URL = isTunnel 
  ? 'https://your-api-public-url.com' // Замените на публичный URL вашего API
  : Platform.select({
      ios: 'http://192.168.0.11:7254', // IP компьютера в беспроводной сети
      android: 'http://10.0.2.2:7254', // Специальный IP для эмулятора Android
      default: 'http://localhost:7254',
    });

// Типы для работы с API
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

export type ApiError = string | null;

// Создаем инстанс HTTP клиента
const apiClient = new HttpClient(API_BASE_URL, {
  Accept: 'application/json, text/plain',
  'Cache-Control': 'no-cache',
});

// Экспортируем API методы
export const api = {
  // Реэкспортируем методы авторизации из модуля auth
  setAuthHeader: authApi.setAuthHeader,
  
  // Реэкспортируем API авторизации
  auth: authApi,

  // Реэкспортируем API для работы с растениями
  plants: plantsApi,

  // Метод для проверки соединения с API
  ping: async () => {
    return apiClient.get<string>('/api/Test/ping', {
      headers: { accept: 'text/plain' },
    });
  },

  // API для работы с пользователями
  users: {
    getProfile: async () => {
      return apiClient.get<User>('/api/users/profile');
    },

    updateProfile: async (data: Partial<User>) => {
      return apiClient.put<User>('/api/users/profile', data as unknown as Record<string, unknown>);
    },

    deleteAccount: async () => {
      return apiClient.delete<{ success: boolean }>('/api/users/account');
    },
    
    // Метод для получения информации о текущем пользователе
    getCurrentUser: async () => {
      return apiClient.get<User>('/api/User/me', {
        headers: { accept: 'text/plain' }
      });
    },
  },
};

export default api;
