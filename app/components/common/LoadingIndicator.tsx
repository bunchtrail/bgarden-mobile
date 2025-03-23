import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

const LoadingIndicator = () => (
  <ThemedView style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4CAF50" />
  </ThemedView>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator; 