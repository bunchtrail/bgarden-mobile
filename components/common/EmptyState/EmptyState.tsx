import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { styles } from './styles';

interface EmptyStateProps {
  message: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, children }) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>{message}</ThemedText>
      {children}
    </View>
  );
};

export default EmptyState; 