import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Specimen } from '@/types';
import { DetailRow } from './DetailRow';
import { styles } from './styles';

interface PlantBasicInfoProps {
  plant: Specimen;
}

export const PlantBasicInfo: React.FC<PlantBasicInfoProps> = ({ plant }) => {
  // Безопасное получение значений для растения
  const russianName = plant.russianName || 'Без русского названия';
  const latinName = plant.latinName || (plant.genus && plant.species ? `${plant.genus} ${plant.species}` : 'Без латинского названия');
  const familyName = plant.family?.name || 'Семейство не указано';

  return (
    <>
      {/* Названия вынесены из секции для акцента */}
      <ThemedText style={styles.russianName}>{russianName}</ThemedText>
      <ThemedText style={styles.latinName}>{latinName}</ThemedText>

      {/* Секция: Основная информация */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Основная информация</ThemedText>
        <DetailRow label="Семейство" value={familyName} />
        {(plant.genus || plant.species) ? (
          <DetailRow label="Род / Вид" value={`${plant.genus || ''} ${plant.species || ''}`.trim()} />
        ) : null}
        <DetailRow label="Сорт" value={plant.cultivar} />
        <DetailRow label="Форма" value={plant.form} />
        <DetailRow label="Синонимы" value={plant.synonyms} />
        <DetailRow label="Определил" value={plant.determinedBy} />
      </View>
    </>
  );
};

export default PlantBasicInfo; 