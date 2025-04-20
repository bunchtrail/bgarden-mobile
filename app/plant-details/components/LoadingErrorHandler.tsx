import React from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { styles } from './styles';

interface LoadingErrorHandlerProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onBack: () => void;
  children: React.ReactNode;
}

export const LoadingErrorHandler: React.FC<LoadingErrorHandlerProps> = ({
  loading,
  error,
  onRetry,
  onBack,
  children
}) => {
  if (loading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <ThemedText style={{ marginTop: 10 }}>Загрузка данных...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.errorText}>Ошибка</ThemedText>
        <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>{error}</ThemedText>
        <TouchableOpacity style={styles.backButton} onPress={onRetry}>
          <ThemedText style={{ color: 'white' }}>Попробовать снова</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.backButton, {marginTop: 10, backgroundColor: '#aaa'}]} 
          onPress={onBack}
        >
          <ThemedText style={{ color: 'white' }}>Вернуться назад</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return <>{children}</>; // Используем React.Fragment или <></>
}; 