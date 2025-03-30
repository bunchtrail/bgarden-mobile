import React, { useEffect } from 'react';
import { Stack } from 'expo-router';

import { useAuth } from '@/modules/auth';
import { useAppNavigation } from '@/modules/navigation';
import { HomePage } from '@/components';

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
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HomePage 
        isAuthorized={!!user} 
        isTabsLayout={false} 
        showHeader={true}
      />
    </>
  );
}
