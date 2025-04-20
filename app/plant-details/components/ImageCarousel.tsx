import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator // Добавлено для состояния загрузки
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { styles } from './styles';

interface ImageCarouselProps {
  images: string[];
  isLoading: boolean;
  initialIndex?: number;
  onIndexChange?: (index: number) => void; // Обратный вызов при смене индекса пользователем
}

const { width: screenWidth } = Dimensions.get('window');

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  isLoading,
  initialIndex = 0,
  onIndexChange 
}) => {
  // Используем состояние для текущего индекса, чтобы управлять пагинацией
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const carouselRef = useRef<FlatList>(null);

  // Обновляем внутренний стейт и прокручиваем, если initialIndex изменился извне
  useEffect(() => {
    if (initialIndex !== currentIndex) {
      setCurrentIndex(initialIndex);
      // Прокручиваем только если FlatList уже отрендерен
      setTimeout(() => {
        carouselRef.current?.scrollToIndex({ index: initialIndex, animated: false });
      }, 0);
    }
  }, [initialIndex]);

  // Обработчик события прокрутки карусели
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      if (onIndexChange) {
        onIndexChange(newIndex); // Уведомляем родителя об изменении индекса
      }
    }
  };
  
  // Переход к следующему изображению
  const goToNextImage = () => {
    if (images.length > 1) {
      const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      // Не нужно вручную вызывать setCurrentIndex, FlatList сам обновится
      carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };
  
  // Переход к предыдущему изображению
  const goToPrevImage = () => {
    if (images.length > 1) {
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      // Не нужно вручную вызывать setCurrentIndex
      carouselRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  // Рендерер для элемента карусели изображений
  const renderCarouselItem = ({ item }: { item: string }) => {
    const isPlaceholder = !item || item === 'https://via.placeholder.com/400x300.png?text=Нет+изображения';
    return (
      <View style={styles.carouselItemContainer}>
        {isPlaceholder ? (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={64} color="#999" />
            <ThemedText style={{ marginTop: 10, color: '#999' }}>Изображение отсутствует</ThemedText>
          </View>
        ) : (
          <Image
            source={{ uri: item }}
            style={styles.image}
            resizeMode="cover"
            onError={(e) => {
              console.error("Ошибка загрузки изображения в карусели:", e.nativeEvent.error);
              // Можно отобразить плейсхолдер ошибки
            }}
          />
        )}
      </View>
    );
  };

  // Рендеринг состояния загрузки
  if (isLoading) {
    return (
      <View style={[styles.image, styles.imagePlaceholder]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <ThemedText style={{ marginTop: 10 }}>Загрузка изображения...</ThemedText>
      </View>
    );
  }

  // Рендеринг состояния отсутствия изображений
  if (images.length === 0) {
    return (
      <View style={[styles.image, styles.imagePlaceholder]}>
        <Ionicons name="image-outline" size={64} color="#999" />
        <ThemedText style={{ marginTop: 10, color: '#999' }}>Изображение отсутствует</ThemedText>
      </View>
    );
  }

  // Основной рендеринг карусели
  return (
    <View style={styles.imageCarouselContainer}>
      <FlatList
        ref={carouselRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderCarouselItem}
        keyExtractor={(_, index) => `carousel_image_${index}`}
        onMomentumScrollEnd={handleScroll} // Обновляем индекс после завершения прокрутки
        initialScrollIndex={currentIndex} // Устанавливаем начальный индекс
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        // Важно: добавить onScrollToIndexFailed для обработки ошибок
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            carouselRef.current?.scrollToIndex({ index: info.index, animated: false });
          });
        }}
      />
      
      {/* Кнопки навигации и пагинация */} 
      {images.length > 1 && (
        <>
          {/* Кнопка назад */}
          <TouchableOpacity 
            style={[styles.carouselButton, styles.prevButton]}
            onPress={goToPrevImage}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={30} color="#fff" />
          </TouchableOpacity>
          
          {/* Кнопка вперед */}
          <TouchableOpacity 
            style={[styles.carouselButton, styles.nextButton]}
            onPress={goToNextImage}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={30} color="#fff" />
          </TouchableOpacity>
          
          {/* Пагинация */}
          <View style={styles.paginationContainer}>
            {images.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}; 