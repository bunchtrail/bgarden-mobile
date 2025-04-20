import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Specimen, UserRole, SectorType } from '@/types';
import PlantCardDetailRow from './PlantCardDetailRow';

interface PlantCardDetailsProps {
  specimen: Specimen;
  userRole: UserRole;
}

const PlantCardDetails: React.FC<PlantCardDetailsProps> = ({ specimen, userRole }) => {
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

  const familyName = specimen.family?.name || 'Семейство не указано';
  const genusSpecies = specimen.genus && specimen.species ? `${specimen.genus} ${specimen.species}` : null;
  const sectorTypeName = getSectorTypeName(specimen.sectorType);
  const hasHerbariumText = specimen.hasHerbarium ? 'Имеется' : 'Отсутствует';
  const coordinates = specimen.latitude && specimen.longitude 
    ? `${typeof specimen.latitude === 'number' ? specimen.latitude.toFixed(4) : '0'}, ${typeof specimen.longitude === 'number' ? specimen.longitude.toFixed(4) : '0'}` 
    : null;

  return (
    <View style={styles.detailsContainer}>
      <PlantCardDetailRow label="Семейство" value={familyName} />
      <PlantCardDetailRow label="Род / Вид" value={genusSpecies} />
      <PlantCardDetailRow label="Сорт" value={specimen.cultivar} />
      <PlantCardDetailRow label="Форма" value={specimen.form} />
      <PlantCardDetailRow label="Синонимы" value={specimen.synonyms} />
      <PlantCardDetailRow label="Определил" value={specimen.determinedBy} />
      <PlantCardDetailRow label="Охр. статус" value={specimen.conservationStatus} />
      <PlantCardDetailRow label="Страна" value={specimen.country} />
      <PlantCardDetailRow label="Инв. номер" value={String(specimen.inventoryNumber)} />
      <PlantCardDetailRow label="Сектор" value={String(sectorTypeName)} />
      <PlantCardDetailRow label="Экспозиция" value={specimen.exposition?.name} />
      <PlantCardDetailRow label="Регион" value={specimen.region?.name} />
      <PlantCardDetailRow label="Год посадки" value={specimen.plantingYear ? String(specimen.plantingYear) : null} />
      <PlantCardDetailRow label="Год интродукции" value={specimen.originalYear ? String(specimen.originalYear) : null} />
      <PlantCardDetailRow label="Селекционер" value={specimen.originalBreeder} />
      <PlantCardDetailRow label="Ареал" value={specimen.naturalRange} />
      <PlantCardDetailRow label="Гербарий" value={hasHerbariumText} />
      <PlantCardDetailRow label="Координаты" value={coordinates} />
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
});

export default PlantCardDetails; 