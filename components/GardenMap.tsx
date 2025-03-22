import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * Компонент для отображения карты ботанического сада
 * В будущем здесь будет интерактивная карта 
 */
export default function GardenMap() {
  const backgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={[styles.mapContainer, { backgroundColor }]}>
      <ThemedText style={[styles.mapText, { color: textColor }]}>
        Здесь будет интерактивная карта ботанического сада
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 300,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    textAlign: 'center',
  }
}); 