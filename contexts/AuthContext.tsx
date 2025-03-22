import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Alert } from 'react-native';

import { api, authStorage } from '@/services';
import { AuthResponse, LoginCredentials } from '@/services/api';

interface AuthContextType {
  user: Partial<AuthResponse> | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: LoginCredentials & { email: string }) => Promise<boolean>;
}

// Создаем контекст аутентификации
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Кастомный хук для использования контекста аутентификации
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Провайдер контекста аутентификации
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Partial<AuthResponse> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const segments = useSegments();

  // Проверка аутентификации и перенаправление пользователя
  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';
      const inTabsGroup = segments[0] === '(tabs)';
      
      if (!user && !inAuthGroup && !inTabsGroup) {
        // Если пользователь не аутентифицирован и не на странице авторизации и не на главной странице,
        // перенаправляем на главную страницу
        router.replace('/(tabs)');
      } else if (user && (inAuthGroup || !segments || segments.join('') === '')) {
        // Если пользователь аутентифицирован и на странице авторизации или индексной странице,
        // перенаправляем на главную страницу приложения
        router.replace('/(tabs)');
      }
    }
  }, [user, segments, isLoading]);

  // Проверка существующего токена при загрузке приложения
  useEffect(() => {
    async function loadAuthData() {
      try {
        console.log('Загрузка данных аутентификации...');
        const authData = await authStorage.getAuthData();
        console.log('Полученные данные аутентификации:', authData ? 'Есть данные' : 'Нет данных');
        
        if (authData && authData.token && authData.expiresAt) {
          // Проверяем, истек ли срок действия токена
          const isExpired = authStorage.isTokenExpired(authData.expiresAt);
          console.log('Токен истек:', isExpired);
          
          if (!isExpired) {
            // Валидируем токен на сервере
            console.log('Валидация токена на сервере...');
            try {
              const response = await api.auth.validateToken(authData.token);
              console.log('Результат валидации токена:', response);
              
              if (response.data) {
                console.log('Токен действителен, восстанавливаем сессию');
                setUser(authData);
              } else {
                console.log('Токен недействителен, пытаемся обновить токен');
                // Если токен недействителен, пытаемся обновить его
                await refreshAuthToken();
              }
            } catch (validationError) {
              console.error('Ошибка при валидации токена:', validationError);
              await refreshAuthToken();
            }
          } else {
            console.log('Токен истек, пытаемся обновить токен');
            // Если токен истек, пытаемся обновить его
            await refreshAuthToken();
          }
        } else {
          console.log('Нет данных аутентификации или данные неполные');
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных аутентификации:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAuthData();
  }, []);

  // Обновление токена аутентификации
  async function refreshAuthToken() {
    try {
      console.log('Попытка обновления токена...');
      const refreshToken = await authStorage.getRefreshToken();
      console.log('RefreshToken существует:', !!refreshToken);
      
      if (refreshToken) {
        console.log('Отправка запроса на обновление токена');
        const response = await api.auth.refreshToken(refreshToken);
        console.log('Результат обновления токена:', response);
        
        if (response.data) {
          console.log('Токен успешно обновлен, сохраняем новые данные');
          await authStorage.storeAuthData(response.data);
          setUser(response.data);
          return true;
        } else {
          console.log('Не удалось обновить токен:', response.error);
        }
      }
      
      // Если не удалось обновить токен, очищаем данные аутентификации
      console.log('Очистка данных аутентификации');
      await authStorage.clearAuthData();
      setUser(null);
      return false;
    } catch (error) {
      console.error('Ошибка при обновлении токена:', error);
      await authStorage.clearAuthData();
      setUser(null);
      return false;
    }
  }

  // Вход в систему
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await api.auth.login(credentials);
      
      if (response.data) {
        await authStorage.storeAuthData(response.data);
        setUser(response.data);
        return true;
      } else {
        Alert.alert('Ошибка входа', response.error || 'Неправильное имя пользователя или пароль');
        return false;
      }
    } catch (error) {
      console.error('Ошибка входа', error);
      return false;
    }
  };

  // Регистрация
  const register = async (userData: LoginCredentials & { email: string }): Promise<boolean> => {
    try {
      const response = await api.auth.register(userData);
      
      if (response.data) {
        await authStorage.storeAuthData(response.data);
        setUser(response.data);
        return true;
      } else {
        Alert.alert('Ошибка регистрации', response.error || 'Не удалось зарегистрировать пользователя');
        return false;
      }
    } catch (error) {
      console.error('Ошибка регистрации', error);
      return false;
    }
  };

  // Выход из системы
  const logout = async (): Promise<void> => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Ошибка при выходе', error);
    } finally {
      await authStorage.clearAuthData();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
} 