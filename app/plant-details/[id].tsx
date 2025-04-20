import React, { useCallback } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { UserRole } from '@/types';
import {
  LoadingErrorHandler,
  ImageCarousel,
  ImageGallery,
  PlantBasicInfo,
  PlantLocation,
  PlantAdditionalInfo
} from './components';
import { usePlantDetails, usePlantImages } from './hooks';
import { styles } from './components/styles'; // Импортируем общие стили

export default function PlantDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Получаем ID растения
  const plantId = typeof id === 'string' ? parseInt(id, 10) : Array.isArray(id) ? parseInt(id[0], 10) : 0;
  
  // Используем хуки
  const { plant, loading: plantLoading, error: plantError, loadPlantDetails } = usePlantDetails(plantId);
  const { 
    allImageUrls, 
    currentImageIndex, 
    setCurrentImageIndex, // Получаем для связи галереи и карусели
    isLoading: imagesLoading,
    handleImageSelect, 
    handleMainImageChange,
    handleImageDeleted,
    forceUpdateKey // Используем для обновления ScrollView
  } = usePlantImages(plantId);
  
  // Заглушка для роли пользователя (TODO: Заменить на реальную)
  const userRole: UserRole = UserRole.Client;

  // Обработчик выбора изображения в галерее, который обновит индекс в карусели
  const onGalleryImageSelect = useCallback((imageUrl: string, index: number) => {
    handleImageSelect(imageUrl, index); // Обновляем индекс в хуке
    // Карусель сама обновится через useEffect по initialIndex
  }, [handleImageSelect]);

  // Обработчик смены индекса в карусели
  const onCarouselIndexChange = useCallback((index: number) => {
    setCurrentImageIndex(index); // Обновляем индекс в хуке
  }, [setCurrentImageIndex]);
  
  // Если ID невалидный (определяется в usePlantDetails)
  // Можно добавить специфическую обработку здесь, если нужно
  // if (isNaN(plantId) || plantId <= 0) { ... }
  
  // --- Рендеринг --- 
  
  // Заголовок экрана
  const screenTitle = plant?.russianName || 'Детали растения';

  // Обработка состояний загрузки и ошибки
  // LoadingErrorHandler обернет основной контент
  if (plantLoading) {
      // Можно использовать LoadingErrorHandler или кастомный индикатор здесь
      return <LoadingErrorHandler loading={true} error={null} onRetry={loadPlantDetails} onBack={router.back} children={null} />;
  }
  
  if (plantError) {
       return <LoadingErrorHandler loading={false} error={plantError} onRetry={loadPlantDetails} onBack={router.back} children={null} />;
  }

  // Если растение не найдено после загрузки
  if (!plant) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.errorText}>Растение не найдено</ThemedText>
         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={{ color: 'white' }}>Вернуться назад</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: screenTitle,
          headerShown: true,
        }}
      />

      {/* Обертка для обработки загрузки/ошибки данных РАСТЕНИЯ */}
      {/* Состояния загрузки/ошибки изображений обрабатываются внутри ImageCarousel/ImageGallery */} 
      <ScrollView 
          showsVerticalScrollIndicator={false} 
          key={`scroll_view_${forceUpdateKey}`}
          contentContainerStyle={{ paddingBottom: 30 }} // Добавим отступ снизу
      >
        {/* Карусель изображений */}
        {/* imageContainer обеспечивает высоту и фон */}
        <View style={styles.imageContainer}>
           <ImageCarousel 
              images={allImageUrls}
              isLoading={imagesLoading}
              initialIndex={currentImageIndex}
              onIndexChange={onCarouselIndexChange}
            />
        </View>

        {/* Галерея миниатюр */}
        {/* Не показываем галерею, если нет plantId или изображений меньше или равно 1 */}
        {/* Логика скрытия галереи, если мало картинок, перенесена сюда */}
        {plantId > 0 && allImageUrls.length > 1 && (
            <ImageGallery 
              specimenId={plantId} 
              onImageSelect={onGalleryImageSelect} // Связываем с каруселью
              onMainImageChanged={handleMainImageChange} // Передаем колбэки из хука
              onImageDeleted={handleImageDeleted}       // Передаем колбэки из хука
            />
        )}

        {/* Контейнер для текстовой информации */} 
        <View style={styles.detailsContainer}>
          {/* Компоненты с информацией о растении */} 
          <PlantBasicInfo plant={plant} />
          <PlantLocation plant={plant} />
          <PlantAdditionalInfo plant={plant} />
          
          {/* TODO: Действия пользователя (редактирование, удаление и т.д.) */}
          {/* renderActions() */} 
        </View>
      </ScrollView>
    </ThemedView>
  );
} 