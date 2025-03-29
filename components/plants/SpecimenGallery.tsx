import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Dimensions, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SpecimenImage } from '@/types';
import { useGalleryImages } from '@/modules/plants/hooks';
import ImageUploader from './ImageUploader';
import { LongPress } from '@/components/ui/LongPress';

interface SpecimenGalleryProps {
  specimenId: number;
  title?: string;
}

const { width } = Dimensions.get('window');
const THUMBNAIL_SIZE = width / 3 - 16;

/**
 * Компонент для отображения галереи изображений образца
 */
const SpecimenGallery: React.FC<SpecimenGalleryProps> = ({ 
  specimenId,
  title = 'Галерея изображений'
}) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [fullImageModalVisible, setFullImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { 
    allImages, 
    selectedImages, 
    isLoading, 
    isUploading,
    uploadProgress,
    error, 
    handleImagesChange, 
    handleSaveImages, 
    handleSetMainImage,
    handleDeleteImage,
    clearSelectedImages
  } = useGalleryImages({ specimenId });

  // Открытие модального окна для загрузки изображений
  const handleOpenUploadModal = () => {
    clearSelectedImages();
    setUploadModalVisible(true);
  };

  // Закрытие модального окна загрузки
  const handleCloseUploadModal = () => {
    setUploadModalVisible(false);
  };

  // Просмотр изображения в полноэкранном режиме
  const handleViewFullImage = (index: number) => {
    setSelectedImageIndex(index);
    setFullImageModalVisible(true);
  };

  // Обработчик изменения изображений (адаптирован для ImageUploader)
  const handleImageChange = (images: string[]) => {
    // В React Native мы работаем только со строками URI
    handleImagesChange(images);
  };

  // Обработчик ошибок загрузки
  const handleUploadError = (errorMessage: string) => {
    // eslint-disable-next-line no-console

  };

  // Рендер миниатюры изображения
  const renderImageItem = ({ item, index }: { item: SpecimenImage; index: number }) => {
    const imageActions = [
      {
        id: 'setMain',
        label: 'Установить как основное',
        icon: <Ionicons name="star" size={20} color="#4299e1" />,
        onPress: () => handleSetMainImage(item.id)
      },
      {
        id: 'delete',
        label: 'Удалить',
        icon: <Ionicons name="trash" size={20} color="#f56565" />,
        onPress: () => handleDeleteImage(item.id)
      }
    ];

    // Если изображение уже основное, убираем эту опцию из меню
    if (item.isMain) {
      imageActions.shift();
    }

    return (
      <LongPress 
        actions={imageActions}
        onPress={() => handleViewFullImage(index)}
      >
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: item.thumbnailUrl || item.imageUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          {item.isMain && (
            <View style={styles.mainBadge}>
              <Text style={styles.mainBadgeText}>Основное</Text>
            </View>
          )}
        </View>
      </LongPress>
    );
  };

  return (
    <View style={styles.container}>
      {/* Заголовок и кнопка добавления */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleOpenUploadModal}
        >
          <Ionicons name="cloud-upload-outline" size={20} color="white" />
          <Text style={styles.addButtonText}>Загрузить</Text>
        </TouchableOpacity>
      </View>

      {/* Галерея изображений */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Загрузка изображений...</Text>
        </View>
      ) : allImages.length > 0 ? (
        <FlatList
          data={allImages}
          renderItem={renderImageItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.galleryContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={48} color="#AAAAAA" />
          <Text style={styles.emptyText}>У этого образца пока нет изображений</Text>
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={handleOpenUploadModal}
          >
            <Text style={styles.uploadButtonText}>Загрузить изображения</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Ошибка, если есть */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Модальное окно загрузки изображений */}
      <Modal
        visible={uploadModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseUploadModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Загрузка изображений</Text>
              <TouchableOpacity onPress={handleCloseUploadModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ImageUploader
              value={selectedImages as string[]}
              onChange={handleImageChange}
              onError={handleUploadError}
              loading={isUploading}
            />
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCloseUploadModal}
                disabled={isUploading}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSaveImages}
                disabled={isUploading || selectedImages.length === 0}
              >
                <Text style={styles.saveButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно для просмотра изображений в полном размере */}
      <Modal
        visible={fullImageModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setFullImageModalVisible(false)}
      >
        <View style={styles.fullImageModalContainer}>
          <TouchableOpacity 
            style={styles.closeFullImageButton} 
            onPress={() => setFullImageModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          {allImages.length > 0 && selectedImageIndex < allImages.length && (
            <View style={styles.fullImageContainer}>
              <Image
                source={{ uri: allImages[selectedImageIndex].imageUrl }}
                style={styles.fullImage}
                resizeMode="contain"
              />
              
              <View style={styles.imageControls}>
                {!allImages[selectedImageIndex].isMain && (
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={() => {
                      handleSetMainImage(allImages[selectedImageIndex].id);
                      setFullImageModalVisible(false);
                    }}
                  >
                    <Ionicons name="star" size={20} color="white" />
                    <Text style={styles.controlButtonText}>Сделать основным</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[styles.controlButton, styles.deleteButton]}
                  onPress={() => {
                    handleDeleteImage(allImages[selectedImageIndex].id);
                    setFullImageModalVisible(false);
                  }}
                >
                  <Ionicons name="trash" size={20} color="white" />
                  <Text style={styles.controlButtonText}>Удалить</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
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
  addButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  galleryContainer: {
    padding: 5,
  },
  thumbnailContainer: {
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
  },
  mainBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 102, 204, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderBottomRightRadius: 8,
  },
  mainBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  uploadButton: {
    marginTop: 20,
    backgroundColor: '#0066CC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffeeee',
    borderRadius: 6,
    marginHorizontal: 15,
  },
  errorText: {
    color: '#C00',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fullImageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFullImageButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  fullImageContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '90%',
  },
  imageControls: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: '#C00',
  },
  controlButtonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default SpecimenGallery; 