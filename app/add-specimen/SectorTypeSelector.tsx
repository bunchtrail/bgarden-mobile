import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SectorType } from '@/types';
import { styles } from './styles';

interface SectorTypeSelectorProps {
  sectorType: SectorType;
  setSectorType: (value: SectorType) => void;
}

export function SectorTypeSelector({ sectorType, setSectorType }: SectorTypeSelectorProps) {
  const sectors = [
    { value: SectorType.Dendrology, label: 'Дендрология' },
    { value: SectorType.Flora, label: 'Флора' },
    { value: SectorType.Flowering, label: 'Цветоводство' },
  ];

  return (
    <View style={styles.selectorContainer}>
      <Text style={styles.label}>Тип сектора:</Text>
      <View style={styles.sectorButtonsContainer}>
        {sectors.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.sectorButton,
              sectorType === item.value && styles.sectorButtonSelected,
            ]}
            onPress={() => setSectorType(item.value)}
          >
            <Text
              style={[
                styles.sectorButtonText,
                sectorType === item.value && styles.sectorButtonTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
