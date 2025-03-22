import { Image, StyleSheet, Platform, View, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';

// Тип для имен иконок Ionicons
type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [greeting, setGreeting] = useState<string>('Добро пожаловать');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const primaryColor = useThemeColor({}, 'primary');
  
  useEffect(() => {
    // Определение приветствия в зависимости от времени суток
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Доброе утро');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Добрый день');
    } else {
      setGreeting('Добрый вечер');
    }
    
    // Запуск анимации
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  // Компонент сектора ботанического сада
  const GardenSection = ({ title, icon, description }: { title: string, icon: IconName, description: string }) => (
    <ThemedView 
      style={styles.sectionCard}
      lightColor="#F2F8F5"
      darkColor="#243D30"
    >
      <Ionicons name={icon} size={48} color={primaryColor} style={styles.sectionIcon} />
      <ThemedText type="subtitle" style={styles.sectionTitle}>{title}</ThemedText>
      <ThemedText style={styles.sectionDesc}>{description}</ThemedText>
    </ThemedView>
  );
  
  // Навигационные кнопки для неавторизованного пользователя
  const PublicNavigationButtons = () => (
    <View style={styles.navigationButtons}>
      <Button 
        title="Каталог растений" 
        onPress={() => router.push('/explore')} 
        style={styles.navButton}
      />
      <Button 
        title="Карта сада" 
        onPress={() => router.push('/map')} 
        style={styles.navButton}
      />
      <Button 
        title="Войти" 
        onPress={() => router.push('/(auth)/login')} 
        style={styles.navButton}
        variant="secondary"
      />
    </View>
  );
  
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
      
      <Animated.View style={[
        styles.greetingContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        <ThemedText type="subtitle">
          {greeting}{user ? `, ${user.username || 'Гость'}` : '!'}
        </ThemedText>
        <ThemedText>
          {user 
            ? 'Познакомьтесь с уникальными растениями нашего ботанического сада'
            : 'Ботанический сад Вятского государственного университета приглашает вас познакомиться с уникальной флорой!'}
        </ThemedText>
      </Animated.View>
      
      <ThemedView style={styles.sectionsContainer}>
        <ThemedText type="subtitle" style={styles.sectionsTitle}>Секторы сада</ThemedText>
        <View style={styles.sectionsGrid}>
          <GardenSection 
            title="Дендрология" 
            icon="leaf" 
            description="Коллекция древесных растений, характерных для различных климатических зон"
          />
          <GardenSection 
            title="Флора" 
            icon="planet" 
            description="Богатая коллекция цветковых растений местной и иностранной флоры"
          />
          <GardenSection 
            title="Цветоводство" 
            icon="color-palette" 
            description="Декоративные цветочные растения, используемые в ландшафтном дизайне"
          />
        </View>
      </ThemedView>
      
      {!user && <PublicNavigationButtons />}
      
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="subtitle">Время работы</ThemedText>
        <ThemedText>
          Пн-Пт: 9:00 - 17:00{'\n'}
          Сб: 10:00 - 16:00{'\n'}
          Вс: выходной
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
  greetingContainer: {
    gap: 8,
    marginBottom: 24,
    alignItems: 'center',
    padding: 16,
  },
  sectionsContainer: {
    marginBottom: 24,
  },
  sectionsTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionIcon: {
    marginBottom: 8,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  sectionDesc: {
    textAlign: 'center',
    fontSize: 14,
  },
  navigationButtons: {
    marginBottom: 24,
    gap: 12,
  },
  navButton: {
    marginHorizontal: 16,
  },
  infoContainer: {
    gap: 8,
    marginBottom: 16,
  },
  contactContainer: {
    gap: 8,
    marginBottom: 8,
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
