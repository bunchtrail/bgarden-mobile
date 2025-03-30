import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { getSectorName } from '../utils/sectorUtils';
import { styles } from '../styles';

interface SpecimenHeaderProps {
  isSimpleMode: boolean;
  sectorType: number;
  onCancel: () => void;
}

export function SpecimenHeader({ isSimpleMode, sectorType, onCancel }: SpecimenHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onCancel} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Header
        title={
          isSimpleMode
            ? `Добавление растения: ${getSectorName(sectorType)}`
            : 'Добавление образца растения'
        }
        titleColor="black"
        style={styles.header}
      />
    </View>
  );
} 