import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LocationType } from '@/types';
import { styles } from './styles';

interface LocationTypeSelectorProps {
  locationType: LocationType;
  setLocationType: (value: LocationType) => void;
}

export function LocationTypeSelector({
  locationType,
  setLocationType,
}: LocationTypeSelectorProps) {
  const locations = [
    { value: LocationType.None, label: 'Не указано' },
    { value: LocationType.Geographic, label: 'Географические' },
    { value: LocationType.SchematicMap, label: 'Схематические' },
  ];

  return (
    <View style={styles.selectorContainer}>
      <Text style={styles.label}>Тип координат:</Text>
      <View style={styles.sectorButtonsContainer}>
        {locations.map((loc) => (
          <TouchableOpacity
            key={loc.value}
            style={[
              styles.sectorButton,
              locationType === loc.value && styles.sectorButtonSelected,
            ]}
            onPress={() => setLocationType(loc.value)}
          >
            <Text
              style={[
                styles.sectorButtonText,
                locationType === loc.value && styles.sectorButtonTextSelected,
              ]}
            >
              {loc.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
