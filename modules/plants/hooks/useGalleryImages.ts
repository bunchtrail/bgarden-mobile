import { useState, useCallback, useEffect } from 'react';
import { SpecimenImage, BatchSpecimenImageResult } from '@/types';
import { useSpecimenImage } from './useSpecimenImage';
import { specimenImagesApi } from '../services/specimenImagesApi';
import { Platform } from 'react-native';

interface UseGalleryImagesProps {
  specimenId: number;
}

// В React Native мы работаем только со строками URI, а не с объектами File
type ImageSource = Platform['OS'] extends 'web' ? File[] : string[];

interface UseGalleryImagesResult {
  allImages: SpecimenImage[];
  selectedImages: string[];
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  handleImagesChange: (files: string[]) => void;
  handleSaveImages: () => Promise<void>;
  handleSetMainImage: (imageId: number) => Promise<boolean>;
  handleDeleteImage: (imageId: number) => Promise<boolean>;
  clearSelectedImages: () => void;
  loadImages: () => Promise<void>;
}

/**
 * Хук для управления галереей изображений образца
 */
export const useGalleryImages = ({ specimenId }: UseGalleryImagesProps): UseGalleryImagesResult => {
  const [allImages, setAllImages] = useState<SpecimenImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    uploadImage, 
    setAsMainImage, 
    deleteImage, 
    isUploading, 
    uploadProgress 
  } = useSpecimenImage(specimenId);

  // Загрузка всех изображений образца
  const loadImages = useCallback(async () => {
    if (!specimenId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await specimenImagesApi.getBySpecimenId(specimenId);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      if (response.data) {
        setAllImages(response.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при загрузке изображений';
      setError(errorMessage);
      // eslint-disable-next-line no-console
    } finally {
      setIsLoading(false);
    }
  }, [specimenId]);

  // Обработчик изменения выбранных изображений
  const handleImagesChange = useCallback((files: string[]) => {
    setSelectedImages(files);
  }, []);

  // Сохранение (загрузка) изображений
  const handleSaveImages = useCallback(async () => {
    if (selectedImages.length === 0) {
      setError('Не выбрано ни одного изображения');
      return;
    }
    
    try {
      setError(null);
      
      // Проверяем, будет ли изображение основным (если это первое изображение)
      const isMain = allImages.length === 0;
      
      // Загружаем изображения
      const result = await uploadImage(selectedImages, {
        isMain,
        onProgress: (progress) => {
          // Прогресс загрузки можно обрабатывать здесь
        }
      });
      
      if (result) {
        // Обновляем список всех изображений
        await loadImages();
        // Очищаем выбранные изображения
        setSelectedImages([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при загрузке изображений';
      setError(errorMessage);
      // eslint-disable-next-line no-console
    }
  }, [selectedImages, allImages.length, uploadImage, loadImages]);

  // Установка изображения как основного
  const handleSetMainImage = useCallback(async (imageId: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await setAsMainImage(imageId);
      
      if (success) {
        // Обновляем список всех изображений
        await loadImages();
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при установке основного изображения';
      setError(errorMessage);
      // eslint-disable-next-line no-console
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setAsMainImage, loadImages]);

  // Удаление изображения
  const handleDeleteImage = useCallback(async (imageId: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Находим индекс удаляемого изображения
      const deletedImageIndex = allImages.findIndex(img => img.id === imageId);
      if (deletedImageIndex === -1) return false;
      
      const success = await deleteImage(imageId);
      
      if (success) {
        // Обновляем список всех изображений
        await loadImages();
        
        // Корректируем текущий индекс, если удалено текущее или предыдущее изображение
        if (deletedImageIndex <= selectedImageIndex) {
          // Если удалили последнее изображение или текущее, переходим к предыдущему
          if (deletedImageIndex === allImages.length - 1 || deletedImageIndex === selectedImageIndex) {
            const newIndex = Math.max(0, selectedImageIndex - 1);
            setSelectedImageIndex(newIndex);
          } 
          // Если удалили изображение с индексом меньше текущего, уменьшаем текущий индекс
          else if (deletedImageIndex < selectedImageIndex) {
            setSelectedImageIndex(selectedImageIndex - 1);
          }
        }
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при удалении изображения';
      setError(errorMessage);
      // eslint-disable-next-line no-console
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [deleteImage, loadImages, allImages, selectedImageIndex]);

  // Очистка выбранных изображений
  const clearSelectedImages = useCallback(() => {
    setSelectedImages([]);
  }, []);

  // Загружаем изображения при монтировании компонента
  useEffect(() => {
    if (specimenId) {
      loadImages();
    }
  }, [specimenId, loadImages]);

  return {
    allImages,
    selectedImages,
    selectedImageIndex,
    setSelectedImageIndex,
    isLoading,
    isUploading,
    uploadProgress,
    error,
    handleImagesChange,
    handleSaveImages,
    handleSetMainImage,
    handleDeleteImage,
    clearSelectedImages,
    loadImages
  };
}; 