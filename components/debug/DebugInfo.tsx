import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FIXED_CARD_HEIGHT, TAB_BAR_HEIGHT, BOTTOM_MARGIN } from '@/app/constants/layoutConstants';

interface DebugInfoProps {
  width: number;
  height: number;
  currentIndex: number;
  totalItems: number;
}

const DebugInfo = ({ width, height, currentIndex, totalItems }: DebugInfoProps) => {
  if (!__DEV__) return null;
  
  return (
    <View style={styles.debugInfo}>
      <Text style={styles.debugText}>
        Экран: {width}x{height}{'\n'}
        Карточка: {FIXED_CARD_HEIGHT}px{'\n'}
        Индекс: {currentIndex}/{totalItems}{'\n'}
        TabBar отступ: {TAB_BAR_HEIGHT}px{'\n'}
        Нижний отступ: {BOTTOM_MARGIN}px
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  debugInfo: {
    position: 'absolute',
    top: 90,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 5,
    borderRadius: 5,
    zIndex: 1000,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
  }
});

export default DebugInfo; 