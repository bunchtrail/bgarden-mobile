import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { styles } from './styles';

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

export const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => {
  // Не рендерим строку, если значение отсутствует (null, undefined, пустая строка)
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return (
    <View style={styles.detailRow}>
      <ThemedText style={styles.detailLabel}>{label}:</ThemedText>
      {/* Убеждаемся, что значение всегда строка перед рендерингом */}
      <ThemedText style={styles.detailValue}>{String(value)}</ThemedText>
    </View>
  );
}; 