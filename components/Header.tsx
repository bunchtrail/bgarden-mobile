import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export function Header() {
  return (
    <View style={styles.header}>
      <Image source={require('@/assets/images/splash-icon.png')} style={styles.logo} />
      <ThemedText type="title" style={styles.title}>
        Ботанический сад ВятГУ
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  logo: {
    height: 80,
    width: 80,
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    marginTop: 8,
  },
}); 