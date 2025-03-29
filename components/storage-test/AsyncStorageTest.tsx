import { useState } from 'react';
import { Button, View, Alert, StyleSheet } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { STORAGE_KEYS, STORAGE_TEST_VALUES } from '../../constants/StorageKeys';
import { asyncStorageService } from '../../services';

export default function AsyncStorageTest() {
  const [storedValue, setStoredValue] = useState('');
  const TEST_KEY = STORAGE_KEYS.ASYNC_STORAGE.TEST_KEY;

  // Сохранение данных
  const saveData = async () => {
    try {
      await asyncStorageService.saveItem(TEST_KEY, STORAGE_TEST_VALUES.ASYNC_STORAGE_VALUE);
      Alert.alert('Успешно', 'Данные сохранены');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить данные');
    }
  };

  // Чтение данных
  const loadData = async () => {
    try {
      const value = await asyncStorageService.getItem(TEST_KEY);
      if (value !== null) {
        setStoredValue(value);
        Alert.alert('Прочитано', `Значение: ${value}`);
      } else {
        Alert.alert('Внимание', 'Данные не найдены');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось прочитать данные');
    }
  };

  // Удаление данных
  const clearData = async () => {
    try {
      await asyncStorageService.removeItem(TEST_KEY);
      setStoredValue('');
      Alert.alert('Успешно', 'Данные удалены');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить данные');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Тест AsyncStorage</ThemedText>
      <ThemedText style={styles.valueText}>
        Сохраненное значение: {storedValue || 'Пусто'}
      </ThemedText>
      <View style={styles.buttonContainer}>
        <Button title="Сохранить данные" onPress={saveData} />
        <Button title="Загрузить данные" onPress={loadData} />
        <Button title="Удалить данные" onPress={clearData} />
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