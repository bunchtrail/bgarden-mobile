import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Stack } from 'expo-router';

import { useAuth } from '@/modules/auth';
import { useAppNavigation } from '@/modules/navigation';
import { 
  ThemedText,
  ThemedView,
  Header,
  Button,
  PageHeader,
  AboutSection,
  MapSection,
  WorkHoursSection,
  ContactsSection,
  AuthSection
} from '@/components';

export default function Index() {
  const { user, isLoading } = useAuth();
  const { router } = useAppNavigation();
  
  useEffect(() => {
    // Если пользователь авторизован, перенаправляем его на табы
    if (!isLoading && user) {
      router.replace('/(tabs)');
    }
  }, [isLoading, user, router]);
  
  // Если страница загружается, ничего не показываем
  if (isLoading) return null;
  
  // Установка базовой задержки и инкремента для анимаций
  const BASE_DELAY = 300;
  const DELAY_INCREMENT = 200;
  
  return (
    <ThemedView style={styles.mainContainer} lightColor="#4A8F6D" darkColor="#1D3D28">
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Stack.Screen options={{ headerShown: false }} />
        
        {/* Шапка страницы */}
        <PageHeader />
        
        {/* Основной контент */}
        <View style={styles.mainContent}>
          {/* О ботаническом саде */}
          <AboutSection delay={BASE_DELAY} />
          
          {/* Карта */}
          <MapSection delay={BASE_DELAY + DELAY_INCREMENT} />
          
          {/* Часы работы */}
          <WorkHoursSection delay={BASE_DELAY + DELAY_INCREMENT * 2} />
          
          {/* Контактная информация */}
          <ContactsSection delay={BASE_DELAY + DELAY_INCREMENT * 3} />
          
          {/* Кнопки авторизации */}
          <AuthSection />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  mainContent: {
    padding: 16,
  }
});
