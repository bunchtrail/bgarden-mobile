import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Specimen } from '@/types';
import { DetailRow } from './DetailRow';
import { getSectorTypeName } from '../utils/plantUtils';
import { styles } from './styles';

interface PlantLocationProps {
  plant: Specimen;
}

export const PlantLocation: React.FC<PlantLocationProps> = ({ plant }) => {
  // Форматирование координат
  const formatCoordinate = (coord: number | null | undefined): string => {
    return typeof coord === 'number' ? coord.toFixed(4) : 'N/A';
  };
  
  // Форматирование координат на карте
  const formatMapCoordinate = (coord: number | null | undefined): string => {
    return typeof coord === 'number' ? coord.toFixed(2) : 'N/A';
  };
  
  const coordinatesText = `${formatCoordinate(plant.latitude)}, ${formatCoordinate(plant.longitude)}`;
  const mapCoordinatesText = `${formatMapCoordinate(plant.mapX)}, ${formatMapCoordinate(plant.mapY)}`;
  const hasHerbariumText = plant.hasHerbarium ? 'Имеется' : 'Отсутствует';
  const expositionName = plant.exposition?.name || 'Экспозиция не указана';
  const regionName = plant.region?.name || 'Регион не указан';

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Расположение и происхождение</ThemedText>
      <DetailRow label="Инв. номер" value={plant.inventoryNumber} />
      <DetailRow label="Сектор" value={getSectorTypeName(plant.sectorType)} />
      <DetailRow label="Экспозиция" value={expositionName} />
      <DetailRow label="Регион" value={regionName} />
      <DetailRow label="Год посадки" value={plant.plantingYear} />
      {/* Отображаем год выведения только если он не 0 */}
      <DetailRow label="Год выведения" value={plant.originalYear !== 0 ? plant.originalYear : null} /> 
      <DetailRow label="Селекционер" value={plant.originalBreeder} />
      <DetailRow label="Естеств. ареал" value={plant.naturalRange} />
      <DetailRow label="Гербарий" value={hasHerbariumText} />
      
      {/* Отображаем координаты только если они есть */}
      {(plant.latitude !== null || plant.longitude !== null) && (
        <DetailRow label="Координаты (lat, lon)" value={coordinatesText} />
      )}
       
      {/* Отображаем координаты на карте только если они есть */}
      {(plant.mapX !== null || plant.mapY !== null) && (
        <DetailRow label="На карте (X, Y)" value={mapCoordinatesText} />
      )}
       
      <DetailRow label="Происхождение образца" value={plant.sampleOrigin}/>
      <DetailRow label="Страна происхождения" value={plant.country}/>
      <DetailRow label="Дублеты" value={plant.duplicatesInfo}/>
      <DetailRow label="Кем заполнено" value={plant.filledBy}/>
    </View>
  );
};

export default PlantLocation; 