import { useState } from 'react';
import { Button, View, Alert, StyleSheet } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { STORAGE_KEYS, STORAGE_TEST_VALUES } from '../../constants/StorageKeys';
import { secureStoreService } from '../../services';

export default function SecureStoreTest() {
  const [secureValue, setSecureValue] = useState('');
  const SECURE_KEY = STORAGE_KEYS.SECURE_STORE.TEST_KEY;

  // Проверка доступности SecureStore
  const checkAvailability = async () => {
    const isAvailable = await secureStoreService.isAvailable();
    Alert.alert('Доступность', isAvailable ? 'SecureStore доступен' : 'SecureStore недоступен');
  };

  // Сохранение данных
  const saveSecureData = async () => {
    try {
      await secureStoreService.saveItem(SECURE_KEY, STORAGE_TEST_VALUES.SECURE_STORE_VALUE);
      Alert.alert('Успешно', 'Данные сохранены в безопасное хранилище');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить данные в безопасное хранилище');
    }
  };

  // Чтение данных
  const loadSecureData = async () => {
    try {
      const value = await secureStoreService.getItem(SECURE_KEY);
      if (value) {
        setSecureValue(value);
        Alert.alert('Прочитано из SecureStore', `Значение: ${value}`);
      } else {
        Alert.alert('Внимание', 'Защищенные данные не найдены');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось прочитать защищенные данные');
    }
  };

  // Удаление данных
  const clearSecureData = async () => {
    try {
      await secureStoreService.removeItem(SECURE_KEY);
      setSecureValue('');
      Alert.alert('Успешно', 'Защищенные данные удалены');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить защищенные данные');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Тест SecureStore</ThemedText>
      <ThemedText style={styles.valueText}>
        Сохраненное защищенное значение: {secureValue || 'Пусто'}
      </ThemedText>
      <View style={styles.buttonContainer}>
        <Button title="Проверить доступность" onPress={checkAvailability} />
        <Button title="Сохранить данные" onPress={saveSecureData} />
        <Button title="Загрузить данные" onPress={loadSecureData} />
        <Button title="Удалить данные" onPress={clearSecureData} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  valueText: {
    fontSize: 16,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
}); 