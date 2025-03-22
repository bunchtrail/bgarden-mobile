import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { AuthResponse } from './api';

// Ключи для хранения данных аутентификации
const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const AUTH_EXPIRES_KEY = 'auth_expires';
const USER_ID_KEY = 'user_id';
const USERNAME_KEY = 'username';

// Используем разные префиксы для разных хранилищ
const ASYNC_PREFIX = 'async_';

/**
 * Сервис для безопасного хранения данных аутентификации
 * На iOS использует комбинацию SecureStore и AsyncStorage для надежности
 */
export const authStorage = {
  /**
   * Сохраняет данные аутентификации
   */
  async storeAuthData(authData: AuthResponse): Promise<void> {
    try {
      // Функция для сохранения в SecureStore
      const saveToSecureStore = async () => {
        if (authData.token) {
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, String(authData.token));
        }
        if (authData.refreshToken) {
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, String(authData.refreshToken));
        }
        if (authData.expiresAt) {
          await SecureStore.setItemAsync(AUTH_EXPIRES_KEY, String(authData.expiresAt));
        }
        if (authData.userId) {
          await SecureStore.setItemAsync(USER_ID_KEY, String(authData.userId));
        }
        if (authData.username) {
          await SecureStore.setItemAsync(USERNAME_KEY, String(authData.username));
        }
      };

      // Функция для сохранения в AsyncStorage (резервное копирование на iOS)
      const saveToAsyncStorage = async () => {
        if (authData.token) {
          await AsyncStorage.setItem(ASYNC_PREFIX + AUTH_TOKEN_KEY, String(authData.token));
        }
        if (authData.refreshToken) {
          await AsyncStorage.setItem(
            ASYNC_PREFIX + REFRESH_TOKEN_KEY,
            String(authData.refreshToken)
          );
        }
        if (authData.expiresAt) {
          await AsyncStorage.setItem(ASYNC_PREFIX + AUTH_EXPIRES_KEY, String(authData.expiresAt));
        }
        if (authData.userId) {
          await AsyncStorage.setItem(ASYNC_PREFIX + USER_ID_KEY, String(authData.userId));
        }
        if (authData.username) {
          await AsyncStorage.setItem(ASYNC_PREFIX + USERNAME_KEY, String(authData.username));
        }
      };

      // Сохраняем в SecureStore
      await saveToSecureStore();

      // На iOS также сохраняем в AsyncStorage как резервную копию
      if (Platform.OS === 'ios') {
        await saveToAsyncStorage();
      }
    } catch (error) {
      console.error('Ошибка при сохранении данных аутентификации', error);
      throw error;
    }
  },

  /**
   * Получает токен авторизации
   */
  async getAuthToken(): Promise<string | null> {
    try {
      // Сначала пробуем получить из SecureStore
      const secureToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

      // Если на iOS и токен не найден в SecureStore, проверяем AsyncStorage
      if (!secureToken && Platform.OS === 'ios') {
        return await AsyncStorage.getItem(ASYNC_PREFIX + AUTH_TOKEN_KEY);
      }

      return secureToken;
    } catch (error) {
      console.error('Ошибка при получении токена', error);
      return null;
    }
  },

  /**
   * Получает refresh токен
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      // Сначала пробуем получить из SecureStore
      const secureToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      // Если на iOS и токен не найден в SecureStore, проверяем AsyncStorage
      if (!secureToken && Platform.OS === 'ios') {
        return await AsyncStorage.getItem(ASYNC_PREFIX + REFRESH_TOKEN_KEY);
      }

      return secureToken;
    } catch (error) {
      console.error('Ошибка при получении refresh токена', error);
      return null;
    }
  },

  /**
   * Получает все данные аутентификации
   */
  async getAuthData(): Promise<Partial<AuthResponse> | null> {
    try {
      console.log('Получение токена из хранилища...');

      // Пробуем получить токен из SecureStore
      let token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      let refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      let expiresAt = await SecureStore.getItemAsync(AUTH_EXPIRES_KEY);
      let userId = await SecureStore.getItemAsync(USER_ID_KEY);
      let username = await SecureStore.getItemAsync(USERNAME_KEY);

      // На iOS, если токен не найден в SecureStore, пробуем AsyncStorage
      if (Platform.OS === 'ios' && !token) {
        console.log('Токен не найден в SecureStore, проверяем AsyncStorage...');
        token = await AsyncStorage.getItem(ASYNC_PREFIX + AUTH_TOKEN_KEY);

        if (token) {
          console.log('Токен найден в AsyncStorage');
          refreshToken = await AsyncStorage.getItem(ASYNC_PREFIX + REFRESH_TOKEN_KEY);
          expiresAt = await AsyncStorage.getItem(ASYNC_PREFIX + AUTH_EXPIRES_KEY);
          userId = await AsyncStorage.getItem(ASYNC_PREFIX + USER_ID_KEY);
          username = await AsyncStorage.getItem(ASYNC_PREFIX + USERNAME_KEY);
        }
      }

      console.log('Токен получен из хранилища:', !!token);

      if (!token) return null;

      console.log('Все данные авторизации получены из хранилища');
      return {
        token,
        refreshToken: refreshToken || '',
        expiresAt: expiresAt || '',
        userId: userId || '',
        username: username || '',
      };
    } catch (error) {
      console.error('Ошибка при получении данных аутентификации:', error);
      return null;
    }
  },

  /**
   * Удаляет все данные аутентификации
   */
  async clearAuthData(): Promise<void> {
    try {
      console.log('Очистка данных аутентификации из хранилища...');

      // Очищаем SecureStore
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(AUTH_EXPIRES_KEY);
      await SecureStore.deleteItemAsync(USER_ID_KEY);
      await SecureStore.deleteItemAsync(USERNAME_KEY);

      // На iOS также очищаем AsyncStorage
      if (Platform.OS === 'ios') {
        await AsyncStorage.removeItem(ASYNC_PREFIX + AUTH_TOKEN_KEY);
        await AsyncStorage.removeItem(ASYNC_PREFIX + REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(ASYNC_PREFIX + AUTH_EXPIRES_KEY);
        await AsyncStorage.removeItem(ASYNC_PREFIX + USER_ID_KEY);
        await AsyncStorage.removeItem(ASYNC_PREFIX + USERNAME_KEY);
      }

      console.log('Данные аутентификации успешно очищены из хранилища');
    } catch (error) {
      console.error('Ошибка при удалении данных аутентификации:', error);
      throw error;
    }
  },

  /**
   * Проверяет, истек ли срок действия токена
   */
  isTokenExpired(expiresAt: string): boolean {
    if (!expiresAt) return true;

    const expirationDate = new Date(expiresAt);
    const now = new Date();

    return now > expirationDate;
  },
};

export default authStorage;
