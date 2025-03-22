import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const iconColor = useThemeColor({}, 'text');
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Выход из системы',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
            } catch (error) {
              console.error('Ошибка при выходе', error);
              Alert.alert('Ошибка', 'Не удалось выйти из системы');
            } finally {
              setIsLoggingOut(false);
            }
          } 
        },
      ]
    );
  };

  // Если пользователь не авторизован, показываем экран с призывом авторизоваться
  if (!user) {
    return (
      <ThemedView style={[styles.container, styles.unauthContainer]}>
        <Ionicons name="person-circle" size={100} color={iconColor} style={styles.unauthIcon} />
        <ThemedText type="title" style={styles.unauthTitle}>
          Личный кабинет
        </ThemedText>
        <ThemedText style={styles.unauthDescription}>
          Для доступа к личному кабинету необходимо войти в аккаунт или зарегистрироваться
        </ThemedText>
        <View style={styles.unauthButtonsContainer}>
          <Button
            title="Войти"
            onPress={() => router.push('/(auth)/login')}
            style={styles.unauthButton}
          />
          <Button
            title="Регистрация"
            onPress={() => router.push('/(auth)/register')}
            variant="secondary"
            style={styles.unauthButton}
          />
        </View>
      </ThemedView>
    );
  }

  // Для авторизованных пользователей показываем профиль
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={iconColor} />
        </View>
        <ThemedText type="title" style={styles.username}>
          {user.username || 'Пользователь'}
        </ThemedText>
      </View>

      <View style={styles.content}>
        <ProfileMenuItem 
          icon="person" 
          title="Личные данные" 
          onPress={() => Alert.alert('Информация', 'Здесь будет редактирование личных данных')}
        />
        
        <ProfileMenuItem 
          icon="notifications" 
          title="Уведомления" 
          onPress={() => Alert.alert('Информация', 'Здесь будут настройки уведомлений')}
        />
        
        <ProfileMenuItem 
          icon="settings" 
          title="Настройки" 
          onPress={() => Alert.alert('Информация', 'Здесь будут настройки приложения')}
        />
        
        <View style={styles.separator} />
        
        <Button
          title="Выйти из системы"
          onPress={handleLogout}
          variant="secondary"
          loading={isLoggingOut}
          style={styles.logoutButton}
        />
      </View>
    </ThemedView>
  );
}

function ProfileMenuItem({ 
  icon, 
  title, 
  onPress 
}: { 
  icon: React.ComponentProps<typeof Ionicons>['name'], 
  title: string, 
  onPress: () => void 
}) {
  const iconColor = useThemeColor({}, 'text');
  
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemContent}>
        <Ionicons name={icon} size={24} color={iconColor} style={styles.menuItemIcon} />
        <ThemedText style={styles.menuItemTitle}>{title}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  username: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 16,
  },
  separator: {
    height: 20,
  },
  logoutButton: {
    marginTop: 16,
  },
  // Стили для неавторизованного состояния
  unauthContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unauthIcon: {
    marginBottom: 20,
  },
  unauthTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  unauthDescription: {
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  unauthButtonsContainer: {
    width: '100%',
    gap: 16,
  },
  unauthButton: {
    width: '100%',
  },
}); 