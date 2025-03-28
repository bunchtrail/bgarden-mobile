import React from 'react';
import { Tabs } from 'expo-router';
import { TabBarBackground } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../modules/auth/context/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const tabBarBackground =
    colorScheme === 'dark' ? 'rgba(21, 23, 24, 0.85)' : 'rgba(255, 255, 255, 0.85)';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: useThemeColor({}, 'tint'),
        tabBarInactiveTintColor: useThemeColor({}, 'tabIconDefault'),
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => <TabBarBackground color={tabBarBackground} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="leaf" color={color} />,
        }}
      />
      <Tabs.Screen
        name="CatalogScreen"
        options={{
          title: 'Растения',
          headerTitle: 'Каталог растений',
          tabBarIcon: ({ color }) => <TabBarIcon name="flower" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Карта',
          headerTitle: 'Карта сада',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          headerTitle: 'Личный кабинет',
          tabBarIcon: ({ color }) => <TabBarIcon name="person-circle" color={color} />,
          href: user ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="plant-details"
        options={{
          title: 'Растение',
          headerTitle: 'Информация о растении',
          tabBarButton: () => null, // Скрываем из таб-бара
        }}
      />
      <Tabs.Screen
        name="plant-edit"
        options={{
          title: 'Редактирование',
          headerTitle: 'Редактирование растения',
          tabBarButton: () => null, // Скрываем из таб-бара
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}
