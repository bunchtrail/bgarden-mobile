import { useState, useEffect, useCallback } from 'react';
import { useSpecimenImage, useGalleryImages } from '@/modules/plants/hooks';

// Хук для работы с изображениями
export const usePlantImages = (plantId: number) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImageUrls, setAllImageUrls] = useState<string[]>([]);
  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const [forceUpdateKey, setForceUpdateKey] = useState(0); // Для принудительного обновления после действий с изображениями

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

  const isLoading = mainImageLoading || (galleryLoading && !galleryLoaded);

  return {
    allImageUrls,
    currentImageIndex,
    setCurrentImageIndex, // Передаем для управления извне (например, каруселью)
    galleryLoaded,
    isLoading,
    handleImageSelect, 
    handleMainImageChange,
    handleImageDeleted,
    forceUpdateKey // Может понадобиться для key в ScrollView
  };
}; 