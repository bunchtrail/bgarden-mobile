import React, { ReactNode, useEffect } from 'react';
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

export function NavigationProvider({ children }: NavigationProviderProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Определение текущего типа маршрута
  const getCurrentRouteType = (): RouteType | null => {
    if (!segments || !segments.length) return null;

    const firstSegment = segments[0];
    return segmentToRouteType[firstSegment as string] || RouteType.PUBLIC;
  };
  
  // Логирование текущего маршрута при изменении сегментов
  useEffect(() => {
    console.log('[Навигация] Текущий маршрут:', segments.join('/'));
    console.log('[Навигация] Сегменты маршрута:', segments);
    
    const routeType = getCurrentRouteType();
    console.log(`[Навигация] Тип маршрута: ${routeType}`);
  }, [segments]);

  // Логика редиректа при изменении состояния аутентификации или URL
  useEffect(() => {
    if (isLoading) return;

    const currentRouteType = getCurrentRouteType();
    const isRootPath = !segments || segments.join('') === '';

    // Пользователь не залогинен и пытается попасть на защищённый маршрут
    if (!user && currentRouteType === RouteType.PROTECTED) {
      console.log('[Навигация] Редирект неавторизованного пользователя с защищенного маршрута на страницу входа');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace(ROUTES.LOGIN.path as any);
    }
    // Пользователь залогинен, но на странице авторизации или на корневом пути
    else if (user && (currentRouteType === RouteType.AUTH || isRootPath)) {
      console.log('[Навигация] Редирект авторизованного пользователя на домашнюю страницу');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace(ROUTES.HOME.path as any);
    }
  }, [user, segments, isLoading]);

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