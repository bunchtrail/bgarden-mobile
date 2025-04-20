import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Platform, 
  ScrollView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// Используем тип ImagePickerAsset из библиотеки
type ImagePickerAsset = ImagePicker.ImagePickerAsset;

interface ImageUploaderProps {
  value: string[];
  onChange: (images: string[]) => void;
  onError?: (error: string) => void;
  maxImages?: number;
  loading?: boolean;
}

/**
 * Компонент для загрузки и предпросмотра изображений
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  value = [], 
  onChange, 
  onError, 
  maxImages = 5,
  loading = false
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>(value);

  // Запрос разрешений на доступ к галерее изображений
  const requestPermissions = useCallback(async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          const error = 'Необходимо разрешение на доступ к галерее изображений';
          if (onError) onError(error);
          return false;
        }
      }
      return true;
    } catch (_) {
      if (onError) onError('Ошибка при запросе разрешений');
      return false;
    }
  }, [onError]);

  // Обработчик выбора изображений
  const handleChooseImages = useCallback(async () => {
    try {
      // Проверяем разрешения
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      // Если достигнут лимит изображений
      if (selectedImages.length >= maxImages) {
        if (onError) onError(`Достигнут лимит изображений (${maxImages})`);
        return;
      }

      // Открываем пикер изображений
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        // Получаем URI выбранных изображений
        const imageUris = result.assets.map((asset: ImagePickerAsset) => asset.uri);
        
        // Проверяем лимит изображений
        const availableSlots = maxImages - selectedImages.length;
        const imagesToAdd = imageUris.slice(0, availableSlots);
        
        // Если выбрано больше изображений, чем доступно слотов
        if (imageUris.length > availableSlots) {
          if (onError) onError(`Можно добавить только ${availableSlots} изображений`);
        }

        // Обновляем состояние
        const newImages = [...selectedImages, ...imagesToAdd];
        setSelectedImages(newImages);
        onChange(newImages);
      }
    } catch (_) {
      if (onError) onError('Ошибка при выборе изображений');

    }
  }, [selectedImages, maxImages, onChange, onError, requestPermissions]);

  // Удаление изображения
  const handleRemoveImage = useCallback((index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
    onChange(newImages);
  }, [selectedImages, onChange]);

  return (
    <View style={styles.container}>
      {/* Заголовок и кнопка добавления */}
      <View style={styles.header}>
        <Text style={styles.title}>Изображения ({selectedImages.length}/{maxImages})</Text>
        <TouchableOpacity 
          style={[
            styles.addButton, 
            selectedImages.length >= maxImages && styles.disabledButton
          ]} 
          onPress={handleChooseImages}
          disabled={selectedImages.length >= maxImages || loading}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>
      </View>

      {/* Индикатор загрузки */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Загрузка изображений...</Text>
        </View>
      )}

      {/* Предпросмотр изображений */}
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.imagePreviewContainer,
          selectedImages.length === 0 && { flex: 1, width: '100%' }
        ]}
      >
        {selectedImages.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.previewImage} />
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={() => handleRemoveImage(index)}
              disabled={loading}
            >
              <Ionicons name="close-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Заглушка "нет изображений" */}
        {selectedImages.length === 0 && (
          <View style={styles.noImagesContainer}>
            <Ionicons name="images-outline" size={40} color="#AAAAAA" />
            <Text style={styles.noImagesText}>
              Нет выбранных изображений
            </Text>
            <Text style={styles.noImagesSubtext}>
              Нажмите кнопку "Добавить" для загрузки изображений
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#AAAAAA',
  },
  addButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
  },
  noImagesContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    minHeight: 150,
    width: '100%',
    alignSelf: 'stretch',
  },
  noImagesText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  noImagesSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default ImageUploader; 