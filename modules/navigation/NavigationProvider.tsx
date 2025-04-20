import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';

import { useAuth } from '../auth/context/AuthContext';

// Типы маршрутов приложения
export enum RouteType {
  AUTH = 'auth',
  PROTECTED = 'protected',
  PUBLIC = 'public',
}

// Интерфейс для определения маршрутов
export interface RoutePath {
  path: string;
  type: RouteType;
}

// Конфигурация маршрутов приложения
export const ROUTES: Record<string, RoutePath> = {
  // Аутентификация
  LOGIN: { path: '/(auth)/login', type: RouteType.AUTH },
  REGISTER: { path: '/(auth)/register', type: RouteType.AUTH },
  
  // Защищенные маршруты
  HOME: { path: '/(tabs)', type: RouteType.PROTECTED },
  PROFILE: { path: '/(tabs)/profile', type: RouteType.PROTECTED },
  EXPLORE: { path: '/(tabs)/explore', type: RouteType.PROTECTED },
  MAP: { path: '/(tabs)/map', type: RouteType.PROTECTED },
  
  // Публичные маршруты (доступны без авторизации)
  NOT_FOUND: { path: '+not-found', type: RouteType.PUBLIC },
};

// Карта сегментов URL к типам маршрутов
const segmentToRouteType: Record<string, RouteType> = {
  '(auth)': RouteType.AUTH,
  '(tabs)': RouteType.PROTECTED,
};

interface NavigationProviderProps {
  children: ReactNode;
}

const getRouteType = (segments: string[]): 'auth' | 'protected' | 'public' | null => {
  if (!segments || segments.length === 0) return null;
  const firstSegment = segments[0];
  if (firstSegment === '(auth)') return 'auth';
  if (firstSegment === '(tabs)') return 'protected';
  return 'public';
};

export function NavigationProvider({ children }: NavigationProviderProps) {
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading } = useAuth();

  // Храним предыдущие сегменты, чтобы избежать лишних редиректов
  const [prevSegments, setPrevSegments] = useState<string[] | null>(null);

  useEffect(() => {
    if (isLoading) {
      // console.log('[Навигация] Ожидание завершения загрузки аутентификации...');
      return;
    }

    // Добавляем лог для user и segments при isLoading === false
    // console.log('[Навигация] Проверка редиректа. isLoading:', isLoading, 'User:', !!user, 'Segments:', segments);

    // Сравниваем текущие сегменты с предыдущими
    if (prevSegments && prevSegments.join('/') === segments.join('/')) {
      // console.log('[Навигация] Сегменты не изменились, редирект не требуется.');
      return;
    }

    const routeType = getRouteType(segments);
    // console.log(`[Навигация] Тип маршрута: ${routeType}`);

    // Логика редиректа
    if (routeType === 'protected' && !user) {
      // console.log('[Навигация] РЕДИРЕКТ: Неавторизованный пользователь на защищенном маршруте -> /login');
      router.replace('/login');
      setPrevSegments(segments); // Обновляем предыдущие сегменты ПОСЛЕ редиректа
    } else if (routeType === 'auth' && user) {
      // console.log('[Навигация] РЕДИРЕКТ: Авторизованный пользователь на маршруте аутентификации -> /(tabs)');
      router.replace('/(tabs)');
      setPrevSegments(segments); // Обновляем предыдущие сегменты ПОСЛЕ редиректа
    } else {
      // Если редирект не нужен (пользователь уже на правильном типе маршрута)
      // Не обновляем prevSegments здесь, чтобы разрешить повторную проверку при изменении user/isLoading
      // console.log('[Навигация] Редирект не требуется.');
    }
  }, [segments, user, isLoading, router, prevSegments]); // Добавляем prevSegments в зависимости

  return <>{children}</>;
}

// Хук для навигации
export function useAppNavigation() {
  const router = useRouter();

  // Функция для программной навигации
  const navigateTo = (routeName: keyof typeof ROUTES) => {
    const route = ROUTES[routeName];
    if (route) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(route.path as any);
    } else {
    }
  };

  // Функция для замены текущего экрана
  const replaceTo = (routeName: keyof typeof ROUTES) => {
    const route = ROUTES[routeName];
    if (route) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace(route.path as any);
    } else {
    }
  };

  return {
    navigateTo,
    replaceTo,
    router, // Также возвращаем оригинальный router для дополнительных возможностей
  };
} 