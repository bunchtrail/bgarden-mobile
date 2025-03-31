import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { TabBarBackground } from '@/components/ui/TabBarBackground';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/modules/auth/hooks';
import { useRouter } from 'expo-router';

// Определение ролей пользователей (копия из types)
enum UserRoles {
  Administrator = 1,
  Employee = 2,
  Client = 3
}

export default function TabLayout() {
  const colorScheme = useColorScheme() || 'light';
  const { user } = useAuth();
  // Предполагаем, что роль пользователя - клиент
  // В реальном приложении это должно приходить с сервера
  const userRole: number = UserRoles.Client;
  const tabBarBackground =
    colorScheme === 'dark' ? 'rgba(21, 23, 24, 0.85)' : 'rgba(255, 255, 255, 0.85)';
  const router = useRouter();
  
  // Предварительно определяем наличие доступа к экрану добавления
  const hasAddAccess = userRole === UserRoles.Administrator || userRole === UserRoles.Employee;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme]?.tint,
        tabBarInactiveTintColor: Colors[colorScheme]?.tabIconDefault,
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
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Обзор',
          headerTitle: 'Обзор сада',
          tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}
