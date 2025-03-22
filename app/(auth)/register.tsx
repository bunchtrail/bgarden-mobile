import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
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
      console.error('Ошибка при регистрации', err);
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
            <View style={styles.inputContainer}>
              <ThemedText>Имя пользователя</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBackground,
                    color: textColor,
                    borderColor: borderColor,
                  },
                ]}
                placeholder="Введите имя пользователя"
                placeholderTextColor={borderColor}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBackground,
                    color: textColor,
                    borderColor: borderColor,
                  },
                ]}
                placeholder="Введите email"
                placeholderTextColor={borderColor}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>Пароль</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBackground,
                    color: textColor,
                    borderColor: borderColor,
                  },
                ]}
                placeholder="Введите пароль"
                placeholderTextColor={borderColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>Подтверждение пароля</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBackground,
                    color: textColor,
                    borderColor: borderColor,
                  },
                ]}
                placeholder="Подтвердите пароль"
                placeholderTextColor={borderColor}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

            <Button
              title="Зарегистрироваться"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.button}
            />

            <View style={styles.linkContainer}>
              <ThemedText>Уже есть аккаунт?</ThemedText>
              <TouchableWithoutFeedback onPress={goToLogin}>
                <ThemedText style={[styles.link, { color: linkColor }]}>Войти</ThemedText>
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
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  link: {
    fontWeight: '600',
  },
});
