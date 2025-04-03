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
  // Убираем containerStyle, так как стили будут применяться напрямую
  // const containerStyle = isTabsLayout 
  //  ? styles.tabsContainer 
  //  : styles.mainContainer;
  
  // В режиме табов используем упрощенный вид
  if (isTabsLayout) {
    return (
      // Используем ThemedView для фона и flex: 1
      <ThemedView style={styles.tabsScreenContainer}> 
        <ScrollView 
          style={styles.scrollView} // Стиль для самого ScrollView
          contentContainerStyle={styles.tabsContentContainer} // Стиль для контента внутри ScrollView
          showsVerticalScrollIndicator={false} // Скрываем индикатор прокрутки
        >
          {/* Убираем marginBottom из Header и управляем отступом здесь */}
          {showHeader && <Header style={styles.headerInTabs} />} 
          
          {/* Оборачиваем основной контент */}
          <View style={styles.mainContentTabs}> 
            {isAuthorized ? (
              <>
                {/* Убираем marginBottom из UserGreeting */}
                <UserGreeting showUserInfo={true} style={styles.userGreetingCard} /> 
                {/* Убираем marginTop из SectorButtons */}
                <SectorButtons /> 
              </>
            ) : (
              <>
                <BotanicalGardenInfo />
                {/* Добавим небольшой отступ сверху для кнопок авторизации */}
                <AuthButton showLogin={true} showRegister={true} style={styles.authButtonsInTabs} /> 
              </>
            )}
          </View>
        </ScrollView>
      </ThemedView>
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
  // Новый стиль для корневого контейнера экрана вкладок
  tabsScreenContainer: {
    flex: 1,
  },
  // Стиль для ScrollView в режиме вкладок
  scrollView: {
    flex: 1,
  },
  // Стиль для контента ScrollView в режиме вкладок
  tabsContentContainer: {
    paddingVertical: 24, // Вертикальные отступы для всего контента
    paddingHorizontal: 16, // Горизонтальные отступы
  },
  // Стиль для контейнера основного контента в режиме вкладок
  mainContentTabs: {
    gap: 24, // Пространство между UserGreeting и SectorButtons (или Info и Auth)
  },
  // Убираем внешний отступ у Header, когда он в табах
  headerInTabs: {
    marginBottom: 0, // Убираем стандартный отступ
  },
  // Убираем внешний отступ у UserGreeting
  userGreetingCard: {
     marginBottom: 0, // Убираем стандартный отступ
  },
  // Добавляем отступ для кнопок авторизации в табах
  authButtonsInTabs: {
    marginTop: 16, // Небольшой отступ сверху
  },
  container: { // Этот стиль больше не используется для tabsContainer
    flex: 1,
  },
  contentContainer: { // Для Landing Page
    paddingBottom: 32,
  },
  mainContent: { // Для Landing Page
    padding: 16,
  },
  // Старый стиль tabsContainer больше не нужен
  // tabsContainer: {
  //   flex: 1,
  //   backgroundColor: 'transparent',
  // },
}); 