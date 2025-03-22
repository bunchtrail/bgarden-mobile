import { StyleSheet, View, Button, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import AsyncStorageTest from '../components/storage-test/AsyncStorageTest';
import SecureStoreTest from '../components/storage-test/SecureStoreTest';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { asyncStorageService, secureStoreService } from '../services';
import { useEffect } from 'react';

export default function StorageTestScreen() {
  // При монтировании компонента логируем содержимое хранилищ
  useEffect(() => {
    logStorageContents();
  }, []);

  // Функция для логирования содержимого хранилищ
  const logStorageContents = async () => {
    console.log('======= ПРОВЕРКА ХРАНИЛИЩ НА ЭКРАНЕ ТЕСТИРОВАНИЯ =======');
    
    try {
      // Проверяем AsyncStorage
      await asyncStorageService.logAllItems();
      
      // Проверяем SecureStore
      await secureStoreService.logAllItems();
    } catch (error) {
      console.error('Ошибка при логировании хранилищ:', error);
    }
    
    console.log('======= КОНЕЦ ПРОВЕРКИ ХРАНИЛИЩ =======');
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Тестирование хранилищ' }} />
      
      <ScrollView>
        <View style={styles.buttonContainer}>
          <Button 
            title="Вывести содержимое хранилищ в консоль" 
            onPress={logStorageContents} 
          />
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.header}>Тестирование AsyncStorage</ThemedText>
          <AsyncStorageTest />
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.section}>
          <ThemedText style={styles.header}>Тестирование SecureStore</ThemedText>
          <SecureStoreTest />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  separator: {
    height: 2,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  buttonContainer: {
    marginBottom: 30,
  },
}); 