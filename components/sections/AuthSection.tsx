import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { AuthButton } from '@/modules/auth';

interface AuthSectionProps {
  style?: StyleProp<ViewStyle>;
}

export default function AuthSection({ style }: AuthSectionProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateYAnim]);
  
  return (
    <Animated.View 
      style={[
        styles.authButtonsContainer, 
        style,
        { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
      ]}
    >
      <ThemedText style={styles.authText}>
        Войдите в аккаунт, чтобы получить доступ ко всем функциям приложения
      </ThemedText>
      <AuthButton 
        showLogin={true} 
        showRegister={true} 
        variant="primary"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  authButtonsContainer: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 143, 109, 0.1)',
  },
  authText: {
    textAlign: 'center',
    marginBottom: 16,
  },
}); 