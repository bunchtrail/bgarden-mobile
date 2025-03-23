import React from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { useAnimatedSection } from '@/hooks/animations/useAnimatedSection';
import { useAppNavigation } from '@/modules/navigation';
import SectionCard from '../SectionCard';

interface MapSectionProps {
  delay?: number;
}

export default function MapSection({ delay = 0 }: MapSectionProps) {
  const { router } = useAppNavigation();
  const { animatedStyle } = useAnimatedSection(delay);
  
  return (
    <Animated.View style={[styles.sectionContainer, animatedStyle]}>
      <SectionCard icon="map-outline" title="Карта ботанического сада">
        <View style={styles.mapPreviewContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1532509854226-a2d9d8e66f54' }} 
            style={styles.mapPreview} 
            resizeMode="cover"
          />
          <View style={styles.mapOverlay}>
            <ThemedText style={styles.mapPreviewText}>
              Интерактивная карта сада
            </ThemedText>
          </View>
        </View>
        <ThemedText style={styles.sectionText}>
          Интерактивная карта позволит вам ориентироваться в ботаническом саду и узнавать 
          информацию о растениях и экспозициях.
        </ThemedText>
        <Button 
          title="Открыть карту" 
          onPress={() => router.push('/map')} 
          style={styles.mapButton} 
        />
      </SectionCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  mapPreviewContainer: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapPreview: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  mapPreviewText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionText: {
    lineHeight: 22,
    marginBottom: 16,
  },
  mapButton: {
    marginTop: 8,
  },
}); 