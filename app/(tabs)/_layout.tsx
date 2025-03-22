import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { TabBarBackground } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tabBarBackground = colorScheme === 'dark' 
    ? 'rgba(21, 23, 24, 0.85)'
    : 'rgba(255, 255, 255, 0.85)';

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
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="leaf" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}
