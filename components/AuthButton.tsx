import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';

export function AuthButton() {
  const router = useRouter();
  
  return (
    <View style={styles.authContainer}>
      <Button
        title="Войти"
        onPress={() => router.push('/(auth)/login')}
        variant="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
}); 