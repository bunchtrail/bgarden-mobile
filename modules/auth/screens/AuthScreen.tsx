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
import { Stack } from 'expo-router';
import { useAppNavigation } from '@/modules/navigation';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { replaceTo } = useAppNavigation();
  const inputBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'icon');

  const handleLogin = async () => {
    // Базовая валидация
    if (!username || !password) {
      setError('Пожалуйста, введите имя пользователя и пароль');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Здесь должен быть вызов API для авторизации
      // Имитация запроса на сервер
      await new Promise(resolve => setTimeout(resolve, 1000));

      // После успешной авторизации переходим на главную страницу
      replaceTo('HOME');
    } catch (err) {
      setError('Ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ title: 'Авторизация', headerShown: false }} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.inner}>
          <View style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>
              Вход в систему
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

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

            <Button title="Войти" onPress={handleLogin} loading={isLoading} style={styles.button} />
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
}); 