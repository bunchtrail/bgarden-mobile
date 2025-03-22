import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { register, isLoading } = useAuth();
  const router = useRouter();

  const inputBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'icon');
  const linkColor = useThemeColor({}, 'tint');

  const handleRegister = async () => {
    // Базовая валидация
    if (!username || !email || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Введите корректный email адрес');
      return;
    }

    setError('');

    try {
      const success = await register({ username, password, email });

      if (!success) {
        setError('Ошибка при регистрации');
      }
    } catch (err) {
      setError('Ошибка регистрации');
    }
  };

  const goToLogin = () => {
    router.replace('/login');
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
              Регистрация
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
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Введите email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Пароль"
              value={password}
              onChangeText={setPassword}
              placeholder="Введите пароль"
              secureTextEntry
            />

            <Input
              label="Подтверждение пароля"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Повторите пароль"
              secureTextEntry
              error={password !== confirmPassword && confirmPassword ? "Пароли не совпадают" : ""}
            />

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

            <Button
              title="Зарегистрироваться"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.buttonContainer}
            />

            <View style={styles.footerContainer}>
              <ThemedText style={styles.footerText}>Уже есть аккаунт?</ThemedText>
              <TouchableWithoutFeedback onPress={goToLogin}>
                <ThemedText style={[styles.linkText, { color: linkColor }]}>Войти</ThemedText>
              </TouchableWithoutFeedback>
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
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    marginRight: 8,
  },
  linkText: {
    fontWeight: 'bold',
  },
});
