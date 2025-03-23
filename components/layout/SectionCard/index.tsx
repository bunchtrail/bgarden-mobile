import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SectionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function SectionCard({ icon, title, children, style }: SectionCardProps) {
  const primaryColor = useThemeColor({}, 'primary');
  
  return (
    <ThemedView style={[styles.card, style]} lightColor="#FFFFFF" darkColor="#2A2A2A">
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={24} color={primaryColor} />
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {title}
        </ThemedText>
      </View>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 