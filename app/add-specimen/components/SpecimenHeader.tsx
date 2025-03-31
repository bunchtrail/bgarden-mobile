import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { SectorType } from '@/types';
import { getSectorName } from '../utils/sectorUtils';
import { Colors } from '@/constants/Colors';

interface SpecimenHeaderProps {
  sectorType: SectorType;
  onCancel: () => void;
}

export function SpecimenHeader({ sectorType, onCancel }: SpecimenHeaderProps) {
  // Получаем имя сектора для отображения в заголовке
  const sectorName = getSectorName(sectorType);
  
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={onCancel}
        hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.light.text }}>
          Добавление растения
        </Text>
        {sectorType !== undefined && (
          <Text style={{ fontSize: 14, color: Colors.light.primary, marginTop: 4 }}>
            Сектор: {sectorName}
          </Text>
        )}
      </View>
    </View>
  );
} 