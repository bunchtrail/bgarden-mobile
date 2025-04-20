import React, { useCallback, useState } from 'react';
import { ScrollView, View, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { UserRole } from '@/types';
import * as ImagePicker from 'expo-image-picker';
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
import { Button } from '@/components/Button'; // Импортируем компонент Button
import { Ionicons } from '@expo/vector-icons'; // Импортируем иконки

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
    uploadNewImage,
    isUploading,
    forceUpdateKey // Используем для обновления ScrollView
  } = usePlantImages(plantId);
  
  // Заглушка для роли пользователя (TODO: Заменить на реальную)
  const userRole = UserRole.Employee as UserRole; // Исправлено на Employee
  
  // Состояние для отслеживания процесса выбора/загрузки
  const [isPickingOrUploading, setIsPickingOrUploading] = useState(false);

  // Обработчик выбора изображения в галерее, который обновит индекс в карусели
  const onGalleryImageSelect = useCallback((imageUrl: string, index: number) => {
    handleImageSelect(imageUrl, index); // Обновляем индекс в хуке
    // Карусель сама обновится через useEffect по initialIndex
  }, [handleImageSelect]);

  // Обработчик нажатия на кнопку "Добавить фото"
  const handleAddPhotoPress = useCallback(async () => {
    // TODO: Реализовать логику выбора и загрузки фото
    // console.log('Нажата кнопка "Добавить фото"');
    // alert('Функционал добавления фото в разработке.');
    // // Здесь будет вызов функции из хука usePlantImages, например:
    // // handleAddNewImage(); 
    
    setIsPickingOrUploading(true);
    
    // 1. Запрос разрешений
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Требуется разрешение', 'Пожалуйста, предоставьте доступ к галерее в настройках устройства.');
      setIsPickingOrUploading(false);
      return;
    }
    
    // 2. Выбор изображения
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Можно разрешить простое редактирование (кадрирование)
        aspect: [4, 3], // Соотношение сторон для редактора
        quality: 0.8, // Качество изображения (0-1)
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        
        // 3. Загрузка изображения
        const success = await uploadNewImage(imageUri);
        if (success) {
          // showToast('success', 'Изображение успешно загружено.');
          Alert.alert('Успех', 'Изображение успешно загружено.');
        } else {
          // showToast('error', 'Не удалось загрузить изображение.');
          Alert.alert('Ошибка', 'Не удалось загрузить изображение.');
        }
      } else {
        // Пользователь отменил выбор
        // showToast('info', 'Выбор изображения отменен.');
      }
    } catch (error) {
        console.error("Ошибка при выборе или обработке изображения:", error);
        Alert.alert('Ошибка', 'Произошла ошибка при обработке изображения.');
    } finally {
      setIsPickingOrUploading(false);
    }
  }, [uploadNewImage]);

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

        {/* Контейнер для текстовой информации и кнопки */} 
        <View style={styles.detailsContainer}>
        
          {/* Кнопка "Добавить фото" (только для авторизованных) */}
          {/* TODO: Уточнить роли, которым доступно добавление */}
          {userRole !== UserRole.Client && plantId > 0 && (
             <Button 
              title="Добавить фото" 
              onPress={handleAddPhotoPress} 
              disabled={isPickingOrUploading} // Блокируем кнопку во время процесса
              loading={isPickingOrUploading} // Показываем индикатор
              style={{ marginBottom: 15 }} // Добавим отступ снизу
            />
          )}

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