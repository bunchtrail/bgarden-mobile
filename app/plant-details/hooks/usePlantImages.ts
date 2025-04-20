import { useState, useEffect, useCallback } from 'react';
import { useSpecimenImage, useGalleryImages } from '@/modules/plants/hooks';
import { useSpecimenImagesService } from '@/modules/plants/hooks/useSpecimenImagesService';

// Хук для работы с изображениями
export const usePlantImages = (plantId: number) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImageUrls, setAllImageUrls] = useState<string[]>([]);
  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const [forceUpdateKey, setForceUpdateKey] = useState(0); // Для принудительного обновления после действий с изображениями
  const [isUploading, setIsUploading] = useState(false); // Состояние загрузки нового изображения

  // Сервис для работы с изображениями
  const imageService = useSpecimenImagesService();

  const { 
    imageSrc, 
    isLoading: mainImageLoading, 
    fetchSpecimenImage 
  } = useSpecimenImage(plantId);
  const { 
    allImages, 
    isLoading: galleryLoading, 
    loadImages: reloadGalleryImages 
  } = useGalleryImages({ specimenId: plantId });

  useEffect(() => {
    if (allImages && allImages.length > 0) {
      const urls = allImages.map(img => {
        return img.imageUrl || 
          (img.imageDataBase64 ? 
            `data:${img.contentType || 'image/png'};base64,${img.imageDataBase64}` : 
            'https://via.placeholder.com/400x300.png?text=Нет+изображения');
      });
      setAllImageUrls(urls);
      setGalleryLoaded(true);
      // Сбросить индекс при обновлении галереи, если текущий индекс стал невалидным?
      // Пока оставляем как есть, карусель должна сама обработать
    } else if (imageSrc) {
      // Если галереи нет, но есть основное изображение
      setAllImageUrls([imageSrc]);
      setGalleryLoaded(true);
      setCurrentImageIndex(0); // Убедимся, что индекс 0
    } else {
      // Если нет ни галереи, ни основного изображения
      setAllImageUrls([]);
      setGalleryLoaded(true);
      setCurrentImageIndex(0);
    }
  }, [allImages, imageSrc]);

  // Функция для загрузки нового изображения
  const uploadNewImage = useCallback(async (imageUri: string): Promise<boolean> => {
    if (!plantId) {
      console.error("uploadNewImage: plantId is invalid", plantId);
      return false;
    }
    setIsUploading(true);
    try {
      // Используем batchUpload для одного изображения
      // false - не устанавливать как основное по умолчанию
      const result = await imageService.batchUpload(plantId, [imageUri], false);
      if (result && result.successCount > 0) {
        // Успешно загружено, обновляем данные
        await fetchSpecimenImage();
        await reloadGalleryImages();
        setForceUpdateKey(prevKey => prevKey + 1);
        setIsUploading(false);
        return true;
      } else {
        console.error("Ошибка загрузки изображения:", result?.errorMessages);
        // Добавим логирование всего объекта result
        console.log("Полный результат batchUpload (ошибка):", JSON.stringify(result, null, 2)); 
        // TODO: Показать сообщение об ошибке пользователю
        setIsUploading(false);
        return false;
      }
    } catch (err) {
      console.error("Критическая ошибка при загрузке изображения:", err);
       // Добавим логирование всего объекта ошибки
      console.log("Детали ошибки в catch:", JSON.stringify(err, null, 2)); 
      // TODO: Показать сообщение об ошибке пользователю
      setIsUploading(false);
      return false;
    }
  }, [plantId, imageService, fetchSpecimenImage, reloadGalleryImages]);

  // Обработчик выбора изображения в галерее (вызывается из ImageGallery)
  const handleImageSelect = useCallback((imageUrl: string, index: number) => {
    setCurrentImageIndex(index);
    // Прокрутку карусели теперь будет делать сама карусель или родительский компонент
  }, []);

  // Обработчик изменения главного изображения (вызывается из ImageGallery)
  const handleMainImageChange = useCallback(async () => {
    try {
      // Обновляем основное изображение
      await fetchSpecimenImage();
      // Перезагружаем галерею изображений (может поменяться порядок или isMain)
      await reloadGalleryImages();
      setForceUpdateKey(prevKey => prevKey + 1); // Триггер для обновления UI
    } catch (err) {
      console.error("Ошибка при смене главного изображения:", err);
      // TODO: Показать сообщение об ошибке пользователю
    }
  }, [fetchSpecimenImage, reloadGalleryImages]);

  // Обработчик удаления изображения (вызывается из ImageGallery)
  const handleImageDeleted = useCallback(async () => {
    try {
      // Если удалили текущее главное, обновим его
      await fetchSpecimenImage();
      // Перезагружаем галерею изображений
      await reloadGalleryImages();
      
      setForceUpdateKey(prevKey => prevKey + 1); // Триггер для обновления UI
    } catch (err) {
      console.error("Ошибка при удалении изображения:", err);
      // TODO: Показать сообщение об ошибке пользователю
    }
  }, [fetchSpecimenImage, reloadGalleryImages, currentImageIndex]);

  // Объединяем состояния загрузки
  const isLoading = mainImageLoading || (galleryLoading && !galleryLoaded) || isUploading;

  return {
    allImageUrls,
    currentImageIndex,
    setCurrentImageIndex, // Передаем для управления извне (например, каруселью)
    galleryLoaded,
    isLoading, // Общее состояние загрузки (включая upload)
    isUploading, // Отдельное состояние загрузки для кнопки
    handleImageSelect, 
    handleMainImageChange,
    handleImageDeleted,
    uploadNewImage, // Добавляем новую функцию
    forceUpdateKey // Может понадобиться для key в ScrollView
  };
}; 