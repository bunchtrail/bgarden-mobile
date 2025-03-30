import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
// Импортируем компоненты напрямую, а не через индексный файл
import { ThemedView } from './ThemedView';
import PageHeader from './PageHeader';
import AboutSection from './sections/AboutSection';
import MapSection from './sections/MapSection';
import WorkHoursSection from './sections/WorkHoursSection';
import ContactsSection from './sections/ContactsSection';
import AuthSection from './sections/AuthSection';
import { Header } from './Header';
import { BotanicalGardenInfo } from './BotanicalGardenInfo';
import { UserGreeting } from './time-based-greeting';
import { SectorButtons } from './SectorButtons';
import AuthButton from '@/modules/auth/components/AuthButton';

interface HomePageProps {
  isAuthorized: boolean;
  isTabsLayout?: boolean;
  username?: string;
  showHeader?: boolean;
}

/**
 * Универсальный компонент главной страницы
 * Используется как для начальной страницы (landing), так и для главной страницы в табах
 */
export default function HomePage({
  isAuthorized,
  isTabsLayout = false,
  username,
  showHeader = true
}: HomePageProps) {
  // Установка базовой задержки и инкремента для анимаций (только для landing страницы)
  const BASE_DELAY = 300;
  const DELAY_INCREMENT = 200;
  
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'background');
  
  // Разные стили контейнера в зависимости от типа страницы
  const containerStyle = isTabsLayout 
    ? styles.tabsContainer 
    : styles.mainContainer;
  
  // В режиме табов используем упрощенный вид
  if (isTabsLayout) {
    return (
      <ScrollView style={styles.container}>
        {showHeader && <Header />}
        
        {isAuthorized ? (
          <>
            <UserGreeting showUserInfo={true} />
            <SectorButtons />
          </>
        ) : (
          <>
            <BotanicalGardenInfo />
            <AuthButton showLogin={true} showRegister={true} />
          </>
        )}
      </ScrollView>
    );
  }
  
  // В режиме лендинга используем полный вид с анимациями и секциями
  return (
    <ThemedView style={[styles.mainContainer]} lightColor="#4A8F6D" darkColor="#1D3D28">
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {showHeader && <PageHeader />}
        
        <View style={styles.mainContent}>
          {/* <AboutSection delay={BASE_DELAY} />
          <MapSection delay={BASE_DELAY + DELAY_INCREMENT} />
          <WorkHoursSection delay={BASE_DELAY + DELAY_INCREMENT * 2} />
          <ContactsSection delay={BASE_DELAY + DELAY_INCREMENT * 3} /> */}
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
  tabsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
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