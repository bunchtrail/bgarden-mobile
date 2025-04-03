import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { LastLoginInfo } from './LastLoginInfo';
import { UserInfo } from './UserInfo';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

interface UserData {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: number;
  position: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}

interface UserGreetingProps {
  lightColor?: string;
  darkColor?: string;
  showUserInfo?: boolean;
  style?: StyleProp<ViewStyle>;
}

const UserGreeting: React.FC<UserGreetingProps> = React.memo(
  ({ lightColor, darkColor, showUserInfo = false, style }) => {
    const { user } = useAuth();
    const primaryColor = useThemeColor({}, 'primary');
    const cardColor = useThemeColor({}, 'card');
    
    const greeting = useMemo(() => {
      const currentHour = new Date().getHours();
      
      if (currentHour >= 5 && currentHour < 12) {
        return 'Доброе утро';
      } else if (currentHour >= 12 && currentHour < 18) {
        return 'Добрый день';
      } else if (currentHour >= 18 && currentHour < 22) {
        return 'Добрый вечер';
      } else {
        return 'Доброй ночи';
      }
    }, []);

    if (!user) {
      return null;
    }

    // Предполагаем, что user может содержать дополнительные поля, полученные от API
    const userData = user as unknown as UserData;
    const displayName = userData.fullName || userData.username || 'Гость';
    
    return (
      <ThemedView style={[styles.container, style]} lightColor={cardColor} darkColor={cardColor}>
        <View style={styles.header}>
          <View style={styles.leftContent}>
            <ThemedText 
              type="defaultSemiBold" 
              lightColor={primaryColor} 
              darkColor={primaryColor}
              style={styles.greeting}
            >
              {greeting},
            </ThemedText>
            <ThemedText 
              type="title" 
              lightColor={lightColor} 
              darkColor={darkColor}
            >
              {displayName}!
            </ThemedText>
          </View>
          <View style={[styles.statusIndicator, userData.isActive && styles.activeStatus]} />
        </View>
        
        <View style={styles.divider} />
        
        <LastLoginInfo 
          lastLogin={userData.lastLogin} 
          lightColor={lightColor} 
          darkColor={darkColor} 
        />
        
        {showUserInfo && (
          <UserInfo 
            email={userData.email}
            position={userData.position}
            role={userData.role}
            lightColor={lightColor}
            darkColor={darkColor}
          />
        )}
      </ThemedView>
    );
  }
);

UserGreeting.displayName = 'UserGreeting';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leftContent: {
    flex: 1,
  },
  greeting: {
    marginBottom: 4,
    fontSize: 18,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#808080',
    marginLeft: 8,
  },
  activeStatus: {
    backgroundColor: '#4ADE80',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    marginVertical: 12,
  },
});

// Экспорт всех компонентов из папки
export { LastLoginInfo } from './LastLoginInfo';
export { UserInfo } from './UserInfo';
export { UserGreeting };
export default UserGreeting; 