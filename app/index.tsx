import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, ScrollView, Animated, Linking } from 'react-native';
import { Stack, Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { AuthButton, useAuth } from '@/modules/auth';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const primaryColor = useThemeColor({}, 'primary');
  
  // Анимация для элементов страницы
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    // Если пользователь авторизован, перенаправляем его на табы
    if (!isLoading && user) {
      router.replace('/(tabs)');
    }
    
    // Анимация появления содержимого
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isLoading, user, fadeAnim, translateYAnim]);
  
  // Если страница загружается, ничего не показываем
  if (isLoading) return null;
  
  // Если пользователь авторизован, будет перенаправлен (см. useEffect)
  // Отображаем стартовую страницу для незарегистрированных пользователей
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Хедер с логотипом */}
      <ThemedView style={styles.headerContainer} lightColor="#4A8F6D" darkColor="#1D3D28">
        <Header 
          titleColor="white" 
          logoStyle={styles.headerLogo} 
        />
      </ThemedView>
      
      {/* Основной контент */}
      <Animated.View 
        style={[
          styles.mainContent, 
          { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
        ]}
      >
        {/* Общая информация */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">О ботаническом саде</ThemedText>
          <ThemedText style={styles.sectionText}>
            Ботанический сад Вятского государственного университета - это уникальная коллекция растений 
            из различных уголков мира. Сад предоставляет возможность изучения биоразнообразия, 
            проведения научных исследований и организации образовательных экскурсий.
          </ThemedText>
        </ThemedView>
        
        {/* Карта */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Карта ботанического сада</ThemedText>
          <ThemedView style={styles.mapContainer} lightColor="#F2F8F5" darkColor="#243D30">
            <Ionicons name="map-outline" size={60} color={primaryColor} style={styles.mapIcon} />
            <ThemedText style={styles.mapLabel}>
              Интерактивная карта позволит вам ориентироваться в ботаническом саду и узнавать 
              информацию о растениях и экспозициях.
            </ThemedText>
            <Button 
              title="Посмотреть карту" 
              onPress={() => router.push('/map')} 
              style={styles.mapButton} 
            />
          </ThemedView>
        </ThemedView>
        
        {/* Контактная информация */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Часы работы</ThemedText>
          <ThemedText style={styles.sectionText}>
            Пн-Пт: 9:00 - 17:00{'\n'}
            Сб: 10:00 - 16:00{'\n'}
            Вс: выходной
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Контакты</ThemedText>
          <ThemedText style={styles.sectionText}>
            Адрес: г. Киров, ул. Ленина, 198{'\n'}
            Телефон: +7 (8332) 123-45-67{'\n'}
            Email: garden@vyatsu.ru
          </ThemedText>
          <Button 
            title="Позвонить" 
            onPress={() => Linking.openURL('tel:+78332123456')} 
            style={styles.contactButton} 
            variant="secondary"
          />
        </ThemedView>
        
        {/* Кнопки авторизации */}
        <ThemedView style={styles.authButtons}>
          <AuthButton 
            showLogin={true} 
            showRegister={true} 
            variant="primary"
          />
        </ThemedView>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerLogo: {
    width: 120,
    height: 120,
  },
  mainContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionText: {
    marginTop: 8,
    lineHeight: 22,
  },
  mapContainer: {
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapIcon: {
    marginBottom: 12,
  },
  mapLabel: {
    textAlign: 'center',
    marginBottom: 16,
  },
  mapButton: {
    width: '100%',
  },
  contactButton: {
    marginTop: 12,
  },
  authButtons: {
    marginTop: 16,
    gap: 12,
  },
  authButton: {
    width: '100%',
  },
});
