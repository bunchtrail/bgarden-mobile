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

  // Перенаправление на соответствующий маршрут
  const redirectToAppropriateRoute = () => {
    const currentRouteType = getCurrentRouteType();

    // Если загрузка еще идет, ничего не делаем
    if (isLoading) return;

    // Если пользователь не аутентифицирован
    if (!user) {
      // Если пытается получить доступ к защищенному маршруту, перенаправляем на логин
      if (currentRouteType === RouteType.PROTECTED) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.replace(ROUTES.LOGIN.path as any);
      }
      // В противном случае оставляем на текущем маршруте (если это авторизация или публичный маршрут)
    } 
    // Если пользователь аутентифицирован
    else {
      // Если пытается получить доступ к маршруту авторизации, перенаправляем на главную
      if (currentRouteType === RouteType.AUTH) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.replace(ROUTES.HOME.path as any);
      }
      // Защищенные и публичные маршруты доступны
    }
  };

  // Выполняем проверку и перенаправление при изменении состояния аутентификации или URL
  useEffect(() => {
    redirectToAppropriateRoute();
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
      console.error(`Route "${routeName}" not found`);
    }
  };

  // Функция для замены текущего экрана
  const replaceTo = (routeName: keyof typeof ROUTES) => {
    const route = ROUTES[routeName];
    if (route) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace(route.path as any);
    } else {
      console.error(`Route "${routeName}" not found`);
    }
  };

  return {
    navigateTo,
    replaceTo,
    router, // Также возвращаем оригинальный router для дополнительных возможностей
  };
} 