import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Сервис для работы с AsyncStorage
 */
export const asyncStorageService = {
  /**
   * Сохранить значение в AsyncStorage
   * @param key Ключ
   * @param value Значение
   */
  async saveItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  /**
   * Получить значение из AsyncStorage
   * @param key Ключ
   * @returns Значение или null
   */
  async getItem(key: string): Promise<string | null> {
    const value = await AsyncStorage.getItem(key);
    return value;
  },

  /**
   * Удалить значение из AsyncStorage
   * @param key Ключ
   */
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  /**
   * Очистить всё хранилище
   */
  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },

  /**
   * Получить все ключи в хранилище
   */
  async getAllKeys(): Promise<readonly string[]> {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  },

  /**
   * Вывести все данные из хранилища в консоль
   */
  async logAllItems(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      
      if (keys.length === 0) {
        return;
      }
      
      await AsyncStorage.multiGet(keys);
    } catch (error) {
      // Ошибка при чтении данных
    }
  }
};

/**
 * Сервис для работы с SecureStore
 */
export const secureStoreService = {
  // Список известных ключей для SecureStore, так как там нет метода getAllKeys
  KNOWN_KEYS: ['auth_token', 'refresh_token', 'auth_expires', 'user_id', 'username', 'secure_test_key'],

  /**
   * Проверить доступность SecureStore
   * @returns true если доступно
   */
  async isAvailable(): Promise<boolean> {
    const available = await SecureStore.isAvailableAsync();
    return available;
  },

  /**
   * Сохранить значение в SecureStore
   * @param key Ключ
   * @param value Значение
   */
  async saveItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  /**
   * Получить значение из SecureStore
   * @param key Ключ
   * @returns Значение или null
   */
  async getItem(key: string): Promise<string | null> {
    const value = await SecureStore.getItemAsync(key);
    return value;
  },

  /**
   * Удалить значение из SecureStore
   * @param key Ключ
   */
  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },

  /**
   * Вывести все известные данные из SecureStore в консоль
   */
  async logAllItems(): Promise<void> {
    try {
      const isAvailable = await this.isAvailable();
      
      if (!isAvailable) {
        return;
      }
      
      for (const key of this.KNOWN_KEYS) {
        await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      // Ошибка чтения данных
    }
  }
}; 