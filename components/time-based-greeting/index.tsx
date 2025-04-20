import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';

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

    const userData = user as unknown as UserData;
    const displayName = userData.fullName || userData.username || 'Гость';
    
    return (
      <ThemedView style={[styles.container, style]}>
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
      </ThemedView>
    );
  }
);

UserGreeting.displayName = 'UserGreeting';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  leftContent: {
  },
  greeting: {
    marginBottom: 2,
    fontSize: 16,
  },
});

export { LastLoginInfo } from './LastLoginInfo';
export { UserInfo } from './UserInfo';
export { UserGreeting };
export default UserGreeting; 