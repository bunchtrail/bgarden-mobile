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
      const isRootPath = !segments ||segments.join('') === '';

      if (!user && !inAuthGroup && !inTabsGroup) {
        router.replace('/(tabs)');
      } else if (user && (inAuthGroup || isRootPath)) {
        router.replace('/(tabs)');
      }
    }
  }, [user, segments, isLoading]);

  // Проверка существующего токена при загрузке приложения
  useEffect(() => {
    async function loadAuthData() {
      try {
        const authData = await authStorage.getAuthData();

        if (authData && authData.accessToken && authData.expiration) {
          // Проверяем, истек ли срок действия токена
          const isExpired = authStorage.isTokenExpired(authData.expiration);

          if (!isExpired) {
            // Валидируем токен на сервере
            try {
              const response = await api.auth.validateToken(authData.accessToken);

              if (response.data && response.data.valid === true) {
                setUser(authData);
                setIsLoading(false);
                
                // useEffect сработает после изменения состояния
              } else {
                // Если токен недействителен, пытаемся обновить его
                await refreshAuthToken();
              }
            } catch (validationError) {
              await refreshAuthToken();
            }
          } else {
            // Если токен истек, пытаемся обновить его
            await refreshAuthToken();
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        // Ошибка при загрузке данных аутентификации
        setIsLoading(false);
      }
    }

    loadAuthData();
  }, []);

  // Обновление токена аутентификации
  async function refreshAuthToken() {
    try {
      const refreshToken = await authStorage.getRefreshToken();

      if (refreshToken) {
        const response = await api.auth.refreshToken(refreshToken);

        if (response.data) {
          await authStorage.storeAuthData(response.data);
          setUser(response.data);
          setIsLoading(false);
          return true;
        }
      }

      // Если не удалось обновить токен, очищаем данные аутентификации
      await authStorage.clearAuthData();
      setUser(null);
      setIsLoading(false);
      return false;
    } catch (error) {
      await authStorage.clearAuthData();
      setUser(null);
      setIsLoading(false);
      return false;
    }
  }

  // Вход в систему
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await api.auth.login(credentials);

      if (response.data) {
        if (!response.data.accessToken) {
          Alert.alert('Ошибка входа', 'Токен авторизации не получен');
          return false;
        }
        
        // Настраиваем заголовок авторизации для HTTP клиента
        api.setAuthHeader(response.data.accessToken);
        
        // Сохраняем данные авторизации
        await authStorage.storeAuthData(response.data);
        
        // Проверяем, что токен сохранился
        const storedToken = await authStorage.getAuthToken();
        
        if (!storedToken) {
          Alert.alert('Ошибка входа', 'Не удалось сохранить данные авторизации');
          return false;
        }
        
        setUser(response.data);
        return true;
      } else {
        Alert.alert('Ошибка входа', response.error || 'Неправильное имя пользователя или пароль');
        return false;
      }
    } catch (error) {
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
        Alert.alert(
          'Ошибка регистрации',
          response.error || 'Не удалось зарегистрировать пользователя'
        );
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  // Выход из системы
  const logout = async (): Promise<void> => {
    try {
      await api.auth.logout();
    } catch (error) {
      // Игнорируем ошибку
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
