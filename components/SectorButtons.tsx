import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';

export function SectorButtons() {
  const router = useRouter();
  
  return (
    <View style={styles.sectorsContainer}>
      <Button
        title="Дендрология"
        onPress={() => router.push('/explore?sector=dendrology')}
        style={styles.sectorButton}
        variant="primary"
      />
      <Button
        title="Флора"
        onPress={() => router.push('/explore?sector=flora')}
        style={styles.sectorButton}
        variant="primary"
      />
      <Button
        title="Цветоводство"
        onPress={() => router.push('/explore?sector=flowers')}
        style={styles.sectorButton}
        variant="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectorsContainer: {
    gap: 16,
    marginTop: 24,
  },
  sectorButton: {
    marginBottom: 8,
  },
}); 