import HttpClient from '@/services/HttpClient';
import { Platform } from 'react-native';
import { 
  Specimen, 
  SpecimenCreateDto, 
  SpecimenUpdateDto, 
  SpecimenSearchParams, 
  SpecimenCoordinatesDto,
  Family,
  Exposition
} from '@/types';

// Базовый URL API с учетом платформы
const API_BASE_URL = Platform.select({
  ios: 'http://192.168.0.11:7254',
  android: 'http://10.0.2.2:7254',
  default: 'http://localhost:7254',
});

// Создаем экземпляр HTTP клиента для работы с растениями
const plantsHttpClient = new HttpClient(API_BASE_URL, {
  Accept: 'application/json, text/plain',
  'Cache-Control': 'no-cache',
});

// API методы для работы с растениями
export const plantsApi = {
  // Получение списка растений с пагинацией и фильтрацией
  getSpecimens: async (params: SpecimenSearchParams = {}) => {
    // Если указан тип сектора, используем специализированный эндпоинт
    if (params.sectorType !== undefined) {
      return plantsHttpClient.get<Specimen[]>(`/api/Specimen/sector/${params.sectorType}`);
    }
    
    // Если указаны параметры для фильтрации, используем эндпоинт фильтрации
    if (params.query || params.familyId || params.regionId) {
      // Формирование параметров запроса для фильтра
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.append('name', params.query);
      if (params.familyId) queryParams.append('familyId', params.familyId.toString());
      if (params.regionId) queryParams.append('regionId', params.regionId.toString());
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return plantsHttpClient.get<Specimen[]>(`/api/Specimen/filter${queryString}`);
    }
    
    // Если параметров нет, получаем все образцы
    return plantsHttpClient.get<Specimen[]>('/api/Specimen/all');
  },

  // Получение конкретного растения по ID
  getSpecimenById: async (id: number) => {
    return plantsHttpClient.get<Specimen>(`/api/Specimen/${id}`);
  },

  // Создание нового растения
  createSpecimen: async (specimenData: SpecimenCreateDto) => {
    return plantsHttpClient.post<Specimen>('/api/Specimen', specimenData as unknown as Record<string, unknown>);
  },
  
  // Создание нового растения с изображениями
  createSpecimenWithImages: async (specimenData: SpecimenCreateDto, imageUris: string[]) => {
    // Создаем FormData для загрузки файлов и данных
    const formData = new FormData();
    
    // Добавляем данные о растении
    Object.entries(specimenData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, typeof value === 'string' ? value : value.toString());
      }
    });
    
    // Добавляем изображения
    imageUris.forEach((imageUri, index) => {
      // Получаем имя файла из URI
      const uriParts = imageUri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      
      // Определяем MIME-тип на основе расширения файла
      const fileType = fileName.split('.').pop()?.toLowerCase();
      const mimeType = fileType === 'png' ? 'image/png' : 
                      fileType === 'jpg' || fileType === 'jpeg' ? 'image/jpeg' : 
                      'application/octet-stream';
      
      // Добавляем файл в formData
      formData.append('images', {
        uri: imageUri,
        name: fileName,
        type: mimeType,
      } as unknown as Blob);
    });
    
    // Отправляем запрос
    return plantsHttpClient.post<{specimen: Specimen, imageIds: number[]}>(
      '/api/Specimen/with-images', 
      formData as unknown as Record<string, unknown>,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
  },

  // Обновление информации о растении
  updateSpecimen: async (id: number, specimenData: SpecimenUpdateDto) => {
    return plantsHttpClient.put<Specimen>(`/api/Specimen/${id}`, specimenData as unknown as Record<string, unknown>);
  },

  // Удаление растения
  deleteSpecimen: async (id: number) => {
    return plantsHttpClient.delete<{ success: boolean }>(`/api/Specimen/${id}`);
  },

  // Обновление координат растения
  updateSpecimenCoordinates: async (id: number, coordinates: SpecimenCoordinatesDto) => {
    return plantsHttpClient.put<Specimen>(
      `/api/Specimen/${id}/location`, 
      coordinates as unknown as Record<string, unknown>
    );
  },

  // Получение списка семейств растений
  getFamilies: async () => {
    return plantsHttpClient.get<Family[]>('/api/Family');
  },
  
  // Получение списка экспозиций (участков ботанического сада)
  getExpositions: async () => {
    return plantsHttpClient.get<Exposition[]>('/api/Exposition');
  },
}; 