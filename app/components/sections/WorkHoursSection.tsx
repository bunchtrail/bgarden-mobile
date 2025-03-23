import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useAnimatedSection } from '@/hooks/animations/useAnimatedSection';
import SectionCard from '../SectionCard';
import { useThemeColor } from '@/hooks/useThemeColor';

interface WorkHoursSectionProps {
  delay?: number;
}

export default function WorkHoursSection({ delay = 0 }: WorkHoursSectionProps) {
  const { animatedStyle } = useAnimatedSection(delay);
  const primaryColor = useThemeColor({}, 'primary');
  
  return (
    <Animated.View style={[styles.sectionContainer, animatedStyle]}>
      <SectionCard icon="time-outline" title="Часы работы">
        <ThemedText style={styles.seasonNote}>Режим работы сада:</ThemedText>
        <View style={styles.hourRow}>
          <ThemedText style={styles.dayText}>Май - Июль</ThemedText>
          <ThemedText style={[styles.timeText, { color: primaryColor }]}>10:00 - 21:00</ThemedText>
        </View>
        <View style={styles.hourRow}>
          <ThemedText style={styles.dayText}>Август</ThemedText>
          <ThemedText style={[styles.timeText, { color: primaryColor }]}>10:00 - 20:00</ThemedText>
        </View>
        <View style={styles.hourRow}>
          <ThemedText style={styles.dayText}>Сентябрь</ThemedText>
          <ThemedText style={[styles.timeText, { color: primaryColor }]}>10:00 - 19:00</ThemedText>
        </View>
        <View style={styles.hourRow}>
          <ThemedText style={styles.dayText}>Понедельник</ThemedText>
          <ThemedText style={styles.dayOffText}>Выходной</ThemedText>
        </View>
        
        <ThemedText style={[styles.seasonNote, {marginTop: 16}]}>Магазин "Семена":</ThemedText>
        <View style={styles.hourRow}>
          <ThemedText style={styles.dayText}>Ежедневно</ThemedText>
          <ThemedText style={[styles.timeText, { color: primaryColor }]}>8:00 - 19:00</ThemedText>
        </View>
        
        <ThemedText style={styles.noteText}>
          Касса закрывается за полчаса до закрытия сада.
        </ThemedText>
      </SectionCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  seasonNote: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dayText: {
    fontWeight: '500',
  },
  timeText: {
    fontWeight: 'bold',
  },
  dayOffText: {
    fontStyle: 'italic',
    color: '#E57373',
  },
  noteText: {
    fontStyle: 'italic',
    marginTop: 12,
    fontSize: 13,
  },
}); 