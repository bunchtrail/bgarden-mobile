import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Specimen } from '@/types';
import { DetailRow } from './DetailRow';
import { styles } from './styles';

interface PlantAdditionalInfoProps {
  plant: Specimen;
}

export const PlantAdditionalInfo: React.FC<PlantAdditionalInfoProps> = ({ plant }) => {
  const hasAdditionalInfoSection = plant.ecologyAndBiology || plant.economicUse || plant.conservationStatus;
  const hasNotesSection = !!plant.notes;

  // Не рендерим компонент, если нет ни одной из секций
  if (!hasAdditionalInfoSection && !hasNotesSection) {
    return null;
  }
  
  return (
    <>
      {/* Секция: Дополнительная информация */} 
      {hasAdditionalInfoSection && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Дополнительная информация</ThemedText>
          <DetailRow label="Экология и биология" value={plant.ecologyAndBiology} />
          <DetailRow label="Хозяйственное использование" value={plant.economicUse} />
          <DetailRow label="Статус сохранности" value={plant.conservationStatus} />
        </View>
      )}

      {/* Секция: Описание (Заметки) */} 
      {hasNotesSection && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Описание</ThemedText>
          {/* Используем String() для безопасности, хотя notes должно быть строкой */} 
          <ThemedText style={styles.description}>{String(plant.notes)}</ThemedText>
        </View>
      )}
    </>
  );
}; 