import { Image, StyleSheet, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { api } from '@/services';

export default function HomeScreen() {
  const [pingResponse, setPingResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<string | null>(null);
  
  // Получение информации о сети устройства
  useEffect(() => {
    async function getNetworkInfo() {
      try {
        // Получаем IP с помощью expo-network (может вернуть внешний IP)
        const expoIp = await Network.getIpAddressAsync();
        const networkType = await Network.getNetworkStateAsync();
        
        // Используем альтернативный способ для получения реальных локальных IP-адресов
        let localIp = "не найден";
        
        NetInfo.fetch().then((state: any) => {
          const details = JSON.stringify(state, null, 2);
          console.log("Подробная информация о сети:", details);
          
          // Используем безопасное обращение к свойствам объекта
          const ipAddress = state?.details?.ipAddress;
          if (ipAddress) {
            localIp = ipAddress;
          }
          
          setDeviceInfo(`Внешний IP: ${expoIp}\nЛокальный IP телефона: ${localIp}\nIP сервера: 192.168.0.11\nТип сети: ${networkType.type}\nПодключено: ${networkType.isConnected ? 'Да' : 'Нет'}`);
        });
      } catch (e: any) {
        console.error('Ошибка получения сетевой информации:', e);
        setDeviceInfo(`Ошибка получения сетевой информации: ${e.message}`);
      }
    }
    
    getNetworkInfo();
  }, []);
  
  const handlePingRequest = async () => {
    try {
      setLoading(true);
      
      // Используем наш HttpClient через api сервис
      console.log('Выполняем ping запрос через HttpClient');
      
      const response = await api.ping();
      
      if (response.data) {
        console.log('Получен ответ:', response.data);
        setPingResponse(response.data.toString());
      } else {
        console.error('Ошибка API:', response.error);
        const errorMessage = Platform.OS === 'ios' 
          ? `Ошибка соединения на iOS: ${response.error}\nПроверьте настройки ATS в app.json и сетевое соединение`
          : `Ошибка соединения: ${response.error}`;
        setPingResponse(errorMessage);
      }
    } catch (error: any) {
      console.error('Непредвиденная ошибка при вызове API:', error);
      const errorMessage = `Непредвиденная ошибка: ${error.message || 'неизвестная ошибка'}`;
      setPingResponse(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4A8F6D', dark: '#1D3D28' }}
      headerImage={
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={styles.gardenLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Ботанический сад ВятГУ</ThemedText>
      </ThemedView>
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="subtitle">Добро пожаловать!</ThemedText>
        <ThemedText>
          Ботанический сад Вятского государственного университета приглашает вас погрузиться в мир уникальной флоры нашего региона и редких растений со всего мира.
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.buttonContainer}>
        <Button 
          title="Проверить API" 
          onPress={handlePingRequest} 
          loading={loading}
        />
        {deviceInfo && (
          <ThemedView style={styles.infoBox}>
            <ThemedText type="defaultSemiBold">Информация об устройстве:</ThemedText>
            <ThemedText>{deviceInfo}</ThemedText>
          </ThemedView>
        )}
        {pingResponse && (
          <ThemedView style={styles.responseContainer}>
            <ThemedText type="defaultSemiBold">Ответ сервера:</ThemedText>
            <ThemedText>{pingResponse}</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
      
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="subtitle">Время работы</ThemedText>
        <ThemedText>
          Пн-Пт: 9:00 - 17:00{'\n'}
          Сб: 10:00 - 16:00{'\n'}
          Вс: выходной
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="subtitle">Экскурсии</ThemedText>
        <ThemedText>
          Познавательные экскурсии проводятся для групп от 5 человек по предварительной записи.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.contactContainer}>
        <ThemedText type="subtitle">Контакты</ThemedText>
        <ThemedText>
          Адрес: г. Киров, ул. Ленина, 198{'\n'}
          Телефон: +7 (8332) 123-45-67{'\n'}
          Email: garden@vyatsu.ru
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  contentContainer: {
    gap: 8,
    marginBottom: 16,
  },
  infoContainer: {
    gap: 8,
    marginBottom: 16,
  },
  contactContainer: {
    gap: 8,
    marginBottom: 8,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  responseContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoBox: {
    marginTop: 8,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  gardenLogo: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 25,
  },
});
