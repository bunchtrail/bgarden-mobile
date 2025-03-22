import HttpClient from './HttpClient';
import { Platform } from 'react-native';

// Базовый URL API с учетом платформы
const API_BASE_URL = Platform.select({
  ios: 'http://192.168.0.11:7254', // IP компьютера в беспроводной сети
  android: 'http://10.0.2.2:7254', // Специальный IP для эмулятора Android
  default: 'http://localhost:7254',
});

// Создаем инстанс HTTP клиента
const apiClient = new HttpClient(API_BASE_URL, {
  'Accept': 'application/json, text/plain',
  'Cache-Control': 'no-cache',
});

// Экспортируем API методы
export const api = {
  // Метод для проверки соединения с API
  ping: async () => {
    return apiClient.get<string>('/api/Test/ping', { 
      headers: { 'accept': 'text/plain' }
    });
  },

  // Пример метода для получения списка растений
  getPlants: async () => {
    return apiClient.get<any[]>('/plants');
  },
  
  // Пример метода для получения информации о конкретном растении
  getPlantById: async (id: string) => {
    return apiClient.get<any>(`/plants/${id}`);
  },
  
  // Пример метода для добавления нового растения
  createPlant: async (plantData: any) => {
    return apiClient.post<any>('/plants', plantData);
  },
  
  // Пример метода для обновления информации о растении
  updatePlant: async (id: string, plantData: any) => {
    return apiClient.put<any>(`/plants/${id}`, plantData);
  },
  
  // Пример метода для удаления растения
  deletePlant: async (id: string) => {
    return apiClient.delete<any>(`/plants/${id}`);
  }
};

export default api; 