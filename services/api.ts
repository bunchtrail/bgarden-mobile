import HttpClient from './HttpClient';
import { Platform } from 'react-native';

// Базовый URL API с учетом платформы
const API_BASE_URL = Platform.select({
  ios: 'http://192.168.0.11:7254', // IP компьютера в беспроводной сети
  android: 'http://10.0.2.2:7254', // Специальный IP для эмулятора Android
  default: 'http://localhost:7254',
});

// Типы для аутентификации
export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

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
  // Аутентификация
  auth: {
    login: async (credentials: LoginCredentials) => {
      return apiClient.post<AuthResponse>('/api/auth/login', credentials);
    },

    register: async (userData: LoginCredentials & { email: string }) => {
      return apiClient.post<AuthResponse>('/api/auth/register', userData);
    },

    refreshToken: async (refreshToken: string) => {
      return apiClient.post<AuthResponse>('/api/auth/refresh', { refreshToken });
    },

    logout: async () => {
      return apiClient.post<void>('/api/auth/logout', {});
    },

    validateToken: async (token: string) => {
      return apiClient.get<boolean>('/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });
    },

    resetPassword: async (data: PasswordResetRequest) => {
      return apiClient.post<{ success: boolean }>('/api/auth/reset-password', data);
    },

    completeReset: async (data: PasswordResetComplete) => {
      return apiClient.post<{ success: boolean }>('/api/auth/complete-reset', data);
    },
  },

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
    return apiClient.post<Plant>('/plants', plantData);
  },

  // Пример метода для обновления информации о растении
  updatePlant: async (id: string, plantData: Partial<PlantCreateDto>) => {
    return apiClient.put<Plant>(`/plants/${id}`, plantData);
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
      return apiClient.put<User>('/api/users/profile', data);
    },

    deleteAccount: async () => {
      return apiClient.delete<{ success: boolean }>('/api/users/account');
    },
  },
};

export default api;
