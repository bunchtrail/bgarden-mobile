import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';

export default function PageHeader() {
  return (
    <ThemedView style={styles.headerContainer} lightColor="#4A8F6D" darkColor="#1D3D28">
      <Header 
        titleColor="white" 
        logoStyle={styles.headerLogo} 
      />
      <ThemedText style={styles.headerTagline}>
        Исследуйте мир растений вместе с нами
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerLogo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  headerTagline: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
}); 