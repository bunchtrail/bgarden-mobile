import HttpClient from './HttpClient';
import { Platform } from 'react-native';
import { authApi, PasswordResetRequest, PasswordResetComplete, TokenValidationResponse } from '../modules/auth/services/authApi';
import { AuthResponse, LoginCredentials } from '../modules/auth/types';

// Базовый URL API с учетом платформы
const API_BASE_URL = Platform.select({
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

// Типы для работы с растениями
export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  category: string;
  imageUrl?: string;
  location?: string; 
  careInstructions?: string;
  dateAdded: string;
}

export interface PlantCreateDto {
  name: string;
  scientificName: string;
  description: string;
  category: string;
  imageUrl?: string;
  location?: string;
  careInstructions?: string;
}

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

  // Метод для проверки соединения с API
  ping: async () => {
    return apiClient.get<string>('/api/Test/ping', {
      headers: { accept: 'text/plain' },
    });
  },

  // Пример метода для получения списка растений
  getPlants: async () => {
    return apiClient.get<Plant[]>('/plants');
  },

  // Пример метода для получения информации о конкретном растении
  getPlantById: async (id: string) => {
    return apiClient.get<Plant>(`/plants/${id}`);
  },

  // Пример метода для добавления нового растения
  createPlant: async (plantData: PlantCreateDto) => {
    return apiClient.post<Plant>('/plants', plantData as unknown as Record<string, unknown>);
  },

  // Пример метода для обновления информации о растении
  updatePlant: async (id: string, plantData: Partial<PlantCreateDto>) => {
    return apiClient.put<Plant>(`/plants/${id}`, plantData as unknown as Record<string, unknown>);
  },

  // Пример метода для удаления растения
  deletePlant: async (id: string) => {
    return apiClient.delete<{ success: boolean }>(`/plants/${id}`);
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
