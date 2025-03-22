import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { AuthResponse } from '../types';

// Ключи для хранения данных аутентификации
const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const AUTH_EXPIRES_KEY = 'auth_expires';
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
      // Проверяем, есть ли в ответе token
      if (!authData.accessToken) {
        return;
      }

      // Функция для сохранения в SecureStore
      const saveToSecureStore = async () => {
        if (authData.accessToken) {
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, String(authData.accessToken));
        }
        if (authData.refreshToken) {
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, String(authData.refreshToken));
        }
        if (authData.expiration) {
          await SecureStore.setItemAsync(AUTH_EXPIRES_KEY, String(authData.expiration));
        }
        if (authData.username) {
          await SecureStore.setItemAsync(USERNAME_KEY, String(authData.username));
        }
      };

      // Функция для сохранения в AsyncStorage (резервное копирование на iOS)
      const saveToAsyncStorage = async () => {
        if (authData.accessToken) {
          await AsyncStorage.setItem(ASYNC_PREFIX + AUTH_TOKEN_KEY, String(authData.accessToken));
        }
        if (authData.refreshToken) {
          await AsyncStorage.setItem(
            ASYNC_PREFIX + REFRESH_TOKEN_KEY,
            String(authData.refreshToken)
          );
        }
        if (authData.expiration) {
          await AsyncStorage.setItem(ASYNC_PREFIX + AUTH_EXPIRES_KEY, String(authData.expiration));
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
      } else {
        // Для Android также дублируем в AsyncStorage для большей надежности
        await saveToAsyncStorage();
      }
      
      // Проверяем, что токен действительно сохранился
      await this.getAuthToken();
      
    } catch (error) {
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
      return null;
    }
  },

  /**
   * Получает все данные аутентификации
   */
  async getAuthData(): Promise<Partial<AuthResponse> | null> {
    try {
      // Пробуем получить токен из SecureStore
      let token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      let refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      let expiresAt = await SecureStore.getItemAsync(AUTH_EXPIRES_KEY);
      let username = await SecureStore.getItemAsync(USERNAME_KEY);

      // На iOS, если токен не найден в SecureStore, пробуем AsyncStorage
      if (Platform.OS === 'ios' && !token) {
        token = await AsyncStorage.getItem(ASYNC_PREFIX + AUTH_TOKEN_KEY);

        if (token) {
          refreshToken = await AsyncStorage.getItem(ASYNC_PREFIX + REFRESH_TOKEN_KEY);
          expiresAt = await AsyncStorage.getItem(ASYNC_PREFIX + AUTH_EXPIRES_KEY);
          username = await AsyncStorage.getItem(ASYNC_PREFIX + USERNAME_KEY);
        }
      }

      if (!token) return null;

      return {
        accessToken: token,
        refreshToken: refreshToken || '',
        expiration: expiresAt || '',
        username: username || '',
        tokenType: 'Bearer',
        requiresTwoFactor: false
      };
    } catch (error) {
      return null;
    }
  },

  /**
   * Удаляет все данные аутентификации
   */
  async clearAuthData(): Promise<void> {
    try {
      // Очищаем SecureStore
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(AUTH_EXPIRES_KEY);
      await SecureStore.deleteItemAsync(USERNAME_KEY);

      // На iOS также очищаем AsyncStorage
      if (Platform.OS === 'ios') {
        await AsyncStorage.removeItem(ASYNC_PREFIX + AUTH_TOKEN_KEY);
        await AsyncStorage.removeItem(ASYNC_PREFIX + REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(ASYNC_PREFIX + AUTH_EXPIRES_KEY);
        await AsyncStorage.removeItem(ASYNC_PREFIX + USERNAME_KEY);
      }
    } catch (error) {
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