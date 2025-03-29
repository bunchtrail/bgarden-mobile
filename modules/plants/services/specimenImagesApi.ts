import HttpClient from '@/services/HttpClient';
import { Platform } from 'react-native';
import { 
  SpecimenImage,
  BatchSpecimenImageResult
} from '@/types';

// Базовый URL API с учетом платформы
const API_BASE_URL = Platform.select({
  ios: 'http://192.168.0.11:7254',
  android: 'http://10.0.2.2:7254',
  default: 'http://localhost:7254',
});

// Создаем экземпляр HTTP клиента для работы с изображениями образцов
const specimenImagesHttpClient = new HttpClient(API_BASE_URL, {
  Accept: 'application/json, text/plain',
  'Cache-Control': 'no-cache',
});

/**
 * API методы для работы с изображениями образцов
 */
export const specimenImagesApi = {
  // Получить все изображения для образца
  getBySpecimenId: async (specimenId: number, includeImageData: boolean = true) => {
    return specimenImagesHttpClient.get<SpecimenImage[]>(
      `/api/v1/specimen-images/by-specimen/${specimenId}?includeImageData=${includeImageData}`
    );
  },

  // Получить основное изображение образца
  getMainImageBySpecimenId: async (specimenId: number, includeImageData: boolean = true) => {
    return specimenImagesHttpClient.get<SpecimenImage>(
      `/api/v1/specimen-images/by-specimen/${specimenId}/main?includeImageData=${includeImageData}`
    );
  },

  // Получить изображение по ID
  getById: async (id: number) => {
    return specimenImagesHttpClient.get<SpecimenImage>(
      `/api/v1/specimen-images/${id}`
    );
  },

  // Добавить новое изображение
  add: async (data: CreateSpecimenImageDto) => {
    return specimenImagesHttpClient.post<SpecimenImage>(
      '/api/v1/specimen-images',
      data as unknown as Record<string, unknown>
    );
  },

  // Обновить существующее изображение
  update: async (id: number, data: UpdateSpecimenImageDto) => {
    return specimenImagesHttpClient.put<SpecimenImage>(
      `/api/v1/specimen-images/${id}`,
      data as unknown as Record<string, unknown>
    );
  },

  // Удалить изображение
  delete: async (id: number) => {
    return specimenImagesHttpClient.delete<void>(
      `/api/v1/specimen-images/${id}`
    );
  },

  // Установить изображение как основное
  setAsMain: async (id: number) => {
    return specimenImagesHttpClient.patch<void>(
      `/api/v1/specimen-images/${id}/set-as-main`,
      {}
    );
  },

  // Загрузить набор изображений для образца
  batchUpload: async (specimenId: number, imageUris: string[], isMain: boolean = false) => {
    // Создаем FormData для загрузки файлов
    const formData = new FormData();
    
    // Добавляем ID образца
    formData.append('specimenId', specimenId.toString());
    
    // Добавляем флаг основного изображения
    formData.append('isMain', isMain.toString());
    
    // Добавляем файлы изображений
    imageUris.forEach((imageUri, index) => {
      // Получаем имя файла из URI
      const uriParts = imageUri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      
      // Определяем MIME-тип на основе расширения файла
      const fileType = fileName.split('.').pop()?.toLowerCase();
      const mimeType = fileType === 'png' ? 'image/png' : 
                      fileType === 'jpg' || fileType === 'jpeg' ? 'image/jpeg' : 
                      fileType === 'gif' ? 'image/gif' :
                      fileType === 'webp' ? 'image/webp' :
                      'application/octet-stream';
      
      // Добавляем файл в formData
      formData.append('files', {
        uri: imageUri,
        name: fileName,
        type: mimeType,
      } as unknown as Blob);
    });
    
    // Отправляем запрос
    return specimenImagesHttpClient.post<BatchSpecimenImageResult>(
      '/api/v1/specimen-images/batch-upload',
      formData as unknown as Record<string, unknown>,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
  },
};

/**
 * DTO для создания изображения
 */
export interface CreateSpecimenImageDto {
  specimenId: number;
  description?: string;
  isMain?: boolean;
  imageUrl?: string;
}

/**
 * DTO для обновления изображения
 */
export interface UpdateSpecimenImageDto {
  description?: string;
  isMain?: boolean;
} 