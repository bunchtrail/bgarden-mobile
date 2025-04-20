import React, { useState } from 'react';
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity, // Добавлен для нажатий
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useGalleryImages } from '@/modules/plants/hooks';
import { LongPress } from '@/components/ui/LongPress';
import { ActionItem } from '@/components/ui/LongPress/types';
import { styles } from './styles';

interface ImageGalleryProps {
  specimenId: number;
  onImageSelect?: (imageUrl: string, index: number) => void;
  onMainImageChanged?: () => void; // Обратный вызов при смене главного изображения
  onImageDeleted?: () => void; // Обратный вызов при удалении изображения
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  specimenId, 
  onImageSelect, 
  onMainImageChanged,
  onImageDeleted 
}) => {
  const { 
    allImages, 
    isLoading, 
    error, 
    handleSetMainImage, 
    handleDeleteImage 
  } = useGalleryImages({ specimenId });
  
  // Состояние для отслеживания нажатого элемента для визуального эффекта
  const [pressedItem, setPressedItem] = useState<number | null>(null);
  
  // Обработчик установки главного изображения
  const onSetMainImage = async (imageId: number) => {
    const success = await handleSetMainImage(imageId);
    if (success && onMainImageChanged) {
      onMainImageChanged(); // Вызываем обратный вызов при успешной установке
    }
  };
  
  // Обработчик удаления изображения
  const onDeleteImage = async (imageId: number) => {
    const success = await handleDeleteImage(imageId);
    if (success && onImageDeleted) {
      onImageDeleted(); // Вызываем обратный вызов при успешном удалении
    }
  };
  
  // Если нет изображений или только одно, не показываем галерею
  // Это логика родительского компонента - показывать ли галерею вообще.
  // Здесь же мы обрабатываем случай, когда allImages пуст после загрузки.
  // if (allImages.length <= 1) {
  //   return null;
  // }

  if (isLoading) {
    return (
      <View style={styles.galleryLoading}>
        <ActivityIndicator size="small" color="#4CAF50" />
        <ThemedText style={{ marginTop: 5, fontSize: 12 }}>Загрузка галереи...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.galleryError}>
        <ThemedText style={{ color: '#d32f2f', fontSize: 12 }}>Ошибка загрузки галереи</ThemedText>
      </View>
    );
  }

  // Если массив пуст после загрузки и без ошибки
  if (allImages.length === 0) {
    return (
      <View style={styles.galleryContainer}> 
        <ThemedText style={[styles.galleryTitle, { marginBottom: 0}]}>Галерея изображений</ThemedText>
        <ThemedText style={{ paddingHorizontal: 16, fontSize: 12, color: '#888' }}>Нет дополнительных изображений.</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.galleryContainer}>
      <ThemedText style={styles.galleryTitle}>Галерея изображений ({allImages.length})</ThemedText>
      <FlatList
        data={allImages}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        // Добавим отступ слева для первого элемента, чтобы он не прилегал к краю
        contentContainerStyle={{ paddingRight: 16 }} // Добавим отступ справа для последнего элемента
        renderItem={({ item, index }) => {
          // Определяем URL изображения
          const imageUrl = item.imageUrl || 
            (item.imageDataBase64 ? 
              `data:${item.contentType || 'image/png'};base64,${item.imageDataBase64}` : 
              'https://via.placeholder.com/150.png?text=Нет+изображения');
          
          // Действия при долгом нажатии
          const imageActions: ActionItem[] = [
            {
              id: 'setMain',
              label: 'Установить как основное',
              icon: <Ionicons name="star" size={20} color="#4CAF50" />,
              onPress: () => onSetMainImage(item.id)
            },
            {
              id: 'delete',
              label: 'Удалить',
              icon: <Ionicons name="trash" size={20} color="#d32f2f" />,
              onPress: () => onDeleteImage(item.id)
            }
          ];

          // Если изображение уже основное, убираем эту опцию из меню
          if (item.isMain) {
            imageActions.shift();
          }
              
          return (
            <LongPress 
              actions={imageActions}
              onPress={() => {
                if (onImageSelect) {
                  onImageSelect(imageUrl, index);
                }
              }}
              longPressDuration={800}
              onPressIn={() => setPressedItem(index)}
              onPressOut={() => setPressedItem(null)}
            >
              <View style={[styles.galleryItem, index === 0 && { marginLeft: 16 }]}> 
                <Image
                  source={{ uri: imageUrl }}
                  style={[
                    styles.galleryImage, 
                    pressedItem === index && styles.galleryImagePressed
                  ]}
                  resizeMode="cover"
                />
                {item.isMain && (
                  <View style={styles.mainImageBadge}>
                    <ThemedText style={styles.mainImageText}>Осн.</ThemedText>
                  </View>
                )}
              </View>
            </LongPress>
          );
        }}
      />
    </View>
  );
}; 