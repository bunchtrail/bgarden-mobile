import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Specimen, UserRole, SectorType } from '@/types';
import { useSpecimenImage } from '@/modules/plants/hooks';

const { width } = Dimensions.get('window');

interface PlantCardProps {
  specimen: Specimen;
  isActive: boolean;
  userRole: UserRole;
  onPress: () => void;
  height?: number;
}

const PlantCard: React.FC<PlantCardProps> = ({ specimen, isActive, userRole, onPress, height }) => {


  const [showDetails, setShowDetails] = useState<boolean>(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  // Используем новый хук useSpecimenImage для загрузки изображения
  const { imageSrc } = useSpecimenImage(specimen.id);
  
  // Итоговый URL изображения с резервными вариантами
  const imageUrl = imageSrc || specimen.mainImage || specimen.illustration || 'https://via.placeholder.com/400x600.png?text=Plant+Image';

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isActive ? 1 : 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isActive, fadeAnim]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const getSectorTypeName = (type: number): string => {
    switch (type) {
      case SectorType.Dendrology:
        return 'Дендрология';
      case SectorType.Flora:
        return 'Флора';
      case SectorType.Flowering:
        return 'Цветение';
      default:
        return 'Неизвестно';
    }
  };

  // Доступные действия в зависимости от роли пользователя
  const renderActions = () => {
    if (userRole === UserRole.Administrator) {
      return (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={24} color="white" />
            <Text style={styles.actionText}>Изменить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="trash-outline" size={24} color="white" />
            <Text style={styles.actionText}>Удалить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="ruler" size={24} color="white" />
            <Text style={styles.actionText}>Биометрия</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="flower" size={24} color="white" />
            <Text style={styles.actionText}>Фенология</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (userRole === UserRole.Employee) {
      return (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={24} color="white" />
            <Text style={styles.actionText}>Изменить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="ruler" size={24} color="white" />
            <Text style={styles.actionText}>Биометрия</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="flower" size={24} color="white" />
            <Text style={styles.actionText}>Фенология</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="white" />
            <Text style={styles.actionText}>Поделиться</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color="white" />
            <Text style={styles.actionText}>Сохранить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="location-outline" size={24} color="white" />
            <Text style={styles.actionText}>На карте</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  // Отображение дополнительной информации, если она есть
  const renderAdditionalInfo = () => {
    // Логируем значения перед рендерингом доп. информации

    return (
      <>
        {specimen.cultivar && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Сорт:</Text>
            <Text style={styles.detailValue}>{specimen.cultivar}</Text>
          </View>
        )}
        {specimen.form && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Форма:</Text>
            <Text style={styles.detailValue}>{specimen.form}</Text>
          </View>
        )}
        {specimen.synonyms && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Синонимы:</Text>
            <Text style={styles.detailValue}>{specimen.synonyms}</Text>
          </View>
        )}
        {specimen.determinedBy && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Определил:</Text>
            <Text style={styles.detailValue}>{specimen.determinedBy}</Text>
          </View>
        )}
        {specimen.conservationStatus && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Охр. статус:</Text>
            <Text style={styles.detailValue}>{specimen.conservationStatus}</Text>
          </View>
        )}
        {specimen.country && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Страна:</Text>
            <Text style={styles.detailValue}>{specimen.country}</Text>
          </View>
        )}
      </>
    );
  };

  const specimenName = specimen.russianName || 'Без названия';
  const latinName = specimen.latinName || (specimen.genus && specimen.species ? `${specimen.genus} ${specimen.species}` : 'Без латинского названия');
  const familyName = specimen.family?.name || 'Семейство не указано';

  // Логируем основные вычисляемые значения


  const genusSpecies = specimen.genus && specimen.species ? `${specimen.genus} ${specimen.species}` : null;
  const inventoryNum = specimen.inventoryNumber;
  const sectorTypeName = getSectorTypeName(specimen.sectorType);
  const expositionName = specimen.exposition?.name;
  const regionName = specimen.region?.name;
  const plantingYearStr = specimen.plantingYear ? String(specimen.plantingYear) : null;
  const originalYearStr = specimen.originalYear ? String(specimen.originalYear) : null;
  const originalBreeder = specimen.originalBreeder;
  const naturalRange = specimen.naturalRange;
  const hasHerbariumText = specimen.hasHerbarium ? 'Имеется' : 'Отсутствует';
  const coordinates = specimen.latitude && specimen.longitude ? `${typeof specimen.latitude === 'number' ? specimen.latitude.toFixed(4) : '0'}, ${typeof specimen.longitude === 'number' ? specimen.longitude.toFixed(4) : '0'}` : null;



  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, height: height }]}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <TouchableOpacity style={styles.infoContainer} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.header}>
          <Text style={styles.russianName}>{specimenName}</Text>
          <Text style={styles.latinName}>{latinName}</Text>
        </View>

        <TouchableOpacity style={styles.detailsButton} onPress={toggleDetails}>
          <Text style={styles.detailsButtonText}>
            {showDetails ? 'Скрыть детали' : 'Показать детали'}
          </Text>
          <Ionicons
            name={showDetails ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="white"
          />
        </TouchableOpacity>

        {showDetails && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Семейство:</Text>
              <Text style={styles.detailValue}>{familyName}</Text>
            </View>
            {genusSpecies && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Род / Вид:</Text>
                <Text style={styles.detailValue}>{genusSpecies}</Text>
              </View>
            )}
            {renderAdditionalInfo()}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Инв. номер:</Text>
              <Text style={styles.detailValue}>{String(inventoryNum)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Сектор:</Text>
              <Text style={styles.detailValue}>{String(sectorTypeName)}</Text>
            </View>
            {expositionName && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Экспозиция:</Text>
                <Text style={styles.detailValue}>{expositionName}</Text>
              </View>
            )}
            {regionName && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Регион:</Text>
                <Text style={styles.detailValue}>{regionName}</Text>
              </View>
            )}
            {plantingYearStr && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Год посадки:</Text>
                <Text style={styles.detailValue}>{plantingYearStr}</Text>
              </View>
            )}
            {originalYearStr && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Год интродукции:</Text>
                <Text style={styles.detailValue}>{originalYearStr}</Text>
              </View>
            )}
            {originalBreeder && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Селекционер:</Text>
                <Text style={styles.detailValue}>{originalBreeder}</Text>
              </View>
            )}
            {naturalRange && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ареал:</Text>
                <Text style={styles.detailValue}>{naturalRange}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Гербарий:</Text>
              <Text style={styles.detailValue}>{hasHerbariumText}</Text>
            </View>
            {coordinates && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Координаты:</Text>
                <Text style={styles.detailValue}>{coordinates}</Text>
              </View>
            )}
            
            {renderActions()}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: '#000',
    marginVertical: 0,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    marginBottom: 20,
  },
  russianName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  latinName: {
    color: '#E0E0E0',
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 16,
    marginRight: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  detailsContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#BBBBBB',
    fontSize: 14,
    width: 100,
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});

export default PlantCard; 