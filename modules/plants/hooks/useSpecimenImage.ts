import { useState, useCallback, useEffect } from 'react';
import { specimenImagesApi } from '../services/specimenImagesApi';
import { SpecimenImage, BatchSpecimenImageResult, ProgressEvent } from '@/types';
import HttpClient from '@/services/HttpClient';
import { Platform } from 'react-native';

// Базовый URL API с учетом платформы
const API_BASE_URL = Platform.select({
  ios: 'http://192.168.0.11:7254',
  android: 'http://10.0.2.2:7254',
  default: 'http://localhost:7254',
});

// HTTP клиент для загрузки изображений с поддержкой отслеживания прогресса
const httpClient = new HttpClient(API_BASE_URL, {
  Accept: 'application/json, text/plain',
  'Cache-Control': 'no-cache',
});

interface UploadImageOptions {
  isMain?: boolean;
  description?: string;
  onProgress?: (progress: number) => void;
}

interface UseSpecimenImageResult {
  imageSrc: string | null;
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  fetchSpecimenImage: () => Promise<SpecimenImage | null>;
  uploadImage: (file: File | File[] | string | string[], options?: UploadImageOptions) => Promise<BatchSpecimenImageResult | null>;
  setAsMainImage: (imageId: number) => Promise<boolean>;
  deleteImage: (imageId: number) => Promise<boolean>;
}

/**
 * Хук для управления изображениями образца
 * @param specimenId - ID образца
 */
export const useSpecimenImage = (specimenId: number): UseSpecimenImageResult => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Получение основного изображения образца
  const fetchSpecimenImage = useCallback(async (): Promise<SpecimenImage | null> => {
    if (!specimenId) return null;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await specimenImagesApi.getMainImageBySpecimenId(specimenId);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      if (response.data) {
        // Проверяем, есть ли URL изображения или данные Base64
        if (response.data.imageUrl) {
          setImageSrc(response.data.imageUrl);
        } else if (response.data.imageDataBase64) {
          // Формируем URI для данных Base64
          const prefix = `data:${response.data.contentType || 'image/png'};base64,`;
          setImageSrc(`${prefix}${response.data.imageDataBase64}`);
        }
        return response.data;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при загрузке изображения';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [specimenId]);

  // Загрузка нового изображения
  const uploadImage = useCallback(async (
    file: File | File[] | string | string[], 
    options: UploadImageOptions = {}
  ): Promise<BatchSpecimenImageResult | null> => {
    if (!specimenId) return null;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      
      // Опции по умолчанию
      const { isMain = false, description = '' } = options;
      
      // Формирование FormData
      const formData = new FormData();
      formData.append('specimenId', specimenId.toString());
      formData.append('isMain', isMain.toString());
      
      if (description) {
        formData.append('description', description);
      }

      // В React Native работаем с URI изображений
      if (Platform.OS === 'web') {
        // Веб-версия: работаем с объектами File
        if (Array.isArray(file)) {
          file.forEach(f => {
            formData.append('files', f as unknown as Blob);
          });
        } else {
          formData.append('files', file as unknown as Blob);
        }
      } else {
        // Мобильная версия: работаем с URI изображений
        // Адаптация для React Native, где файлы представлены URI строками
        const imageUris = Array.isArray(file) ? file : [file];
        
        try {
          // Здесь предполагается, что в React Native мы уже имеем URI, а не File
          const response = await specimenImagesApi.batchUpload(
            specimenId, 
            imageUris as unknown as string[], 
            isMain
          );
          
          if (response.error) {
            setError(response.error);
            return null;
          }
          
          if (isMain) {
            await fetchSpecimenImage();
          }
          
          return response.data;
        } catch (uploadError) {
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Ошибка при загрузке изображений';
          setError(errorMessage);
          return null;
        }
      }
      
      // Отправка запроса для веб-версии
      const result = await httpClient.post<BatchSpecimenImageResult>(
        '/api/v1/specimen-images/batch-upload',
        formData as unknown as Record<string, unknown>,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: ProgressEvent) => {
            if (options.onProgress && progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
              options.onProgress(percentCompleted);
            }
          }
        }
      );
      
      if (result.error) {
        setError(result.error);
        return null;
      }
      
      // Обновляем изображение, если загруженное изображение основное
      if (isMain) {
        await fetchSpecimenImage();
      }
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при загрузке изображения';
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [specimenId, fetchSpecimenImage]);

  // Установка изображения как основного
  const setAsMainImage = useCallback(async (imageId: number): Promise<boolean> => {
    if (!imageId) {
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Обновляем токен авторизации перед запросом
      await specimenImagesApi.updateAuthToken();
      
      const response = await specimenImagesApi.setAsMain(imageId);
      
      if (response.error) {
        const errorMessage = `Ошибка при установке основного изображения: ${response.error}`;
        setError(errorMessage);
        
        return false;
      }
      
      // Обновляем основное изображение после установки
      await fetchSpecimenImage();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? `Ошибка при установке основного изображения: ${err.message}` 
        : 'Неизвестная ошибка при установке основного изображения';
      setError(errorMessage);
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchSpecimenImage]);

  // Удаление изображения
  const deleteImage = useCallback(async (imageId: number): Promise<boolean> => {
    if (!imageId) {
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Обновляем токен авторизации перед запросом
      await specimenImagesApi.updateAuthToken();
      
      const response = await specimenImagesApi.delete(imageId);
      
      if (response.error) {
        const errorMessage = `Ошибка при удалении изображения: ${response.error}`;
        setError(errorMessage);
        
        return false;
      }
      
      // Обновляем основное изображение после удаления, на случай если было удалено основное
      await fetchSpecimenImage();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? `Ошибка при удалении изображения: ${err.message}` 
        : 'Неизвестная ошибка при удалении изображения';
      setError(errorMessage);
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchSpecimenImage]);

  // Загружаем изображение при монтировании компонента
  useEffect(() => {
    if (specimenId) {
      fetchSpecimenImage();
    }
  }, [specimenId, fetchSpecimenImage]);

  return {
    imageSrc,
    isLoading,
    isUploading,
    uploadProgress,
    error,
    fetchSpecimenImage,
    uploadImage,
    setAsMainImage,
    deleteImage
  };
}; 