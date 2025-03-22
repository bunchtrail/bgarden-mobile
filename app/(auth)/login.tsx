import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, isLoading } = useAuth();
  const inputBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'icon');
  const linkColor = useThemeColor({}, 'tint');

  const handleLogin = async () => {
    // Базовая валидация
    if (!username || !password) {
      setError('Пожалуйста, введите имя пользователя и пароль');
      return;
    }

    setError('');

    try {
      const success = await login({ username, password });

      if (!success) {
        setError('Неправильное имя пользователя или пароль');
      }
    } catch (err) {
      setError('Ошибка авторизации');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.inner}>
          <View style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>
              Вход в систему
            </ThemedText>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Имя пользователя"
              value={username}
              onChangeText={setUsername}
              placeholder="Введите имя пользователя"
              autoCapitalize="none"
            />

            <Input
              label="Пароль"
              value={password}
              onChangeText={setPassword}
              placeholder="Введите пароль"
              secureTextEntry
            />

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

            <Button 
              title="Войти" 
              onPress={handleLogin} 
              loading={isLoading} 
              style={styles.buttonContainer} 
            />

            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <ThemedText>Нет аккаунта?</ThemedText>
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <ThemedText style={[styles.linkText, { color: linkColor }]}>
                    Зарегистрироваться
                  </ThemedText>
                </Pressable>
              </Link>
            </View>
          </View>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 36,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  formContainer: {
    marginBottom: 24,
  },
  errorText: {
    color: '#E53E3E',
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 12,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 32,
  },
  linkText: {
    fontWeight: 'bold',
  },
});
