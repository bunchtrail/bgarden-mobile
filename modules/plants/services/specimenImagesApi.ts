import HttpClient from '@/services/HttpClient';
import { Platform } from 'react-native';
import { 
  SpecimenImage,
  BatchSpecimenImageResult
} from '@/types';
import { authStorage } from '@/modules/auth/services';

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

// Инициализируем авторизацию при старте
(async () => {
  try {
    const token = await authStorage.getAuthToken();
    if (token) {
      specimenImagesHttpClient.setAuthToken(token);
      console.log('Токен авторизации успешно загружен для HTTP клиента изображений');
    } else {
      console.warn('Токен авторизации не найден при инициализации API изображений');
    }
  } catch (error) {
    console.error('Ошибка при загрузке токена авторизации:', error);
  }
})();

// Логирование запросов (в режиме разработки)
const logRequest = (method: string, url: string, data?: unknown) => {
  if (__DEV__) {
    console.log(`🌐 ${method} ${url}`, data ? data : '');
  }
};

// Логирование ответов (в режиме разработки)
const logResponse = (method: string, url: string, response: unknown) => {
  if (__DEV__) {
    console.log(`✅ ${method} ${url} Response:`, response);
  }
};

// Логирование ошибок
const logError = (method: string, url: string, error: unknown) => {
  console.error(`❌ ${method} ${url} Error:`, error);
};

/**
 * API методы для работы с изображениями образцов
 */
export const specimenImagesApi = {
  // Обновить токен авторизации
  updateAuthToken: async (): Promise<boolean> => {
    try {
      const token = await authStorage.getAuthToken();
      if (token) {
        specimenImagesHttpClient.setAuthToken(token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Ошибка при обновлении токена авторизации:', error);
      return false;
    }
  },

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
    const url = `/api/v1/specimen-images/${id}`;
    logRequest('DELETE', url);
    
    try {
      // Проверяем токен авторизации перед отправкой запроса
      await specimenImagesApi.updateAuthToken();
      
      const response = await specimenImagesHttpClient.delete<void>(url);
      logResponse('DELETE', url, response);
      
      // В случае ошибки авторизации, пробуем обновить токен и повторить запрос
      if (response.status === 401) {
        console.log('Токен авторизации истек, пробуем повторить запрос');
        // Уже обновили выше
        const newResponse = await specimenImagesHttpClient.delete<void>(url);
        logResponse('DELETE (retry)', url, newResponse);
        return newResponse;
      }
      
      return response;
    } catch (error) {
      logError('DELETE', url, error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Ошибка при удалении изображения', 
        status: 500 
      };
    }
  },

  // Установить изображение как основное
  setAsMain: async (id: number) => {
    const url = `/api/v1/specimen-images/${id}/set-as-main`;
    logRequest('PATCH', url);
    
    try {
      // Проверяем токен авторизации перед отправкой запроса
      await specimenImagesApi.updateAuthToken();
      
      // Явно указываем пустой объект в теле запроса и обеспечиваем правильные заголовки
      const response = await specimenImagesHttpClient.patch<SpecimenImage>(
        url,
        {},
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      logResponse('PATCH', url, response);
      
      // В случае ошибки авторизации, пробуем обновить токен и повторить запрос
      if (response.status === 401) {
        console.log('Токен авторизации истек, пробуем повторить запрос');
        // Уже обновили выше
        const newResponse = await specimenImagesHttpClient.patch<SpecimenImage>(
          url,
          {},
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        logResponse('PATCH (retry)', url, newResponse);
        return newResponse;
      }
      
      // Проверяем ответ на ошибки более детально
      if (response.status >= 400) {
        return { 
          data: null, 
          error: response.error || `Ошибка сервера (${response.status})`, 
          status: response.status 
        };
      }
      
      return response;
    } catch (error) {
      logError('PATCH', url, error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Ошибка при установке основного изображения', 
        status: 500 
      };
    }
  },

  // Загрузить набор изображений для образца
  batchUpload: async (specimenId: number, imageUris: string[], isMain: boolean = false) => {
    const url = '/api/v1/specimen-images/batch-upload';
    logRequest('POST', url, { specimenId, imagesCount: imageUris.length, isMain });
    
    try {
      // Проверяем токен авторизации перед отправкой запроса
      await specimenImagesApi.updateAuthToken();
      
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
      const response = await specimenImagesHttpClient.post<BatchSpecimenImageResult>(
        url,
        formData as unknown as Record<string, unknown>,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      logResponse('POST', url, response);
      
      // В случае ошибки авторизации, пробуем обновить токен и повторить запрос
      if (response.status === 401) {
        console.log('Токен авторизации истек, пробуем повторить запрос');
        // Уже обновили выше        
        const newResponse = await specimenImagesHttpClient.post<BatchSpecimenImageResult>(
          url,
          formData as unknown as Record<string, unknown>,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
        );
        logResponse('POST (retry)', url, newResponse);
        return newResponse;
      }
      
      return response;
    } catch (error) {
      logError('POST', url, error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Ошибка при загрузке изображений', 
        status: 500 
      };
    }
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