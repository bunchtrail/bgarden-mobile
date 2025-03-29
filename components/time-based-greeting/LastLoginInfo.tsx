import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface LastLoginInfoProps {
  lastLogin?: string;
  lightColor?: string;
  darkColor?: string;
}

export const LastLoginInfo: React.FC<LastLoginInfoProps> = React.memo(
  ({ lastLogin, lightColor, darkColor }) => {
    const iconColor = useThemeColor({}, 'icon');
    
    if (!lastLogin) {
      return null;
    }

    const formatDate = (dateString: string): string => {
      try {
        const date = new Date(dateString);
        
        const options: Intl.DateTimeFormatOptions = {
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit'
        };
        
        return date.toLocaleDateString('ru-RU', options);
      } catch (error) {
        return 'неизвестно';
      }
    };

    return (
      <View style={styles.container}>
        <Ionicons name="time-outline" size={18} color={iconColor} style={styles.icon} />
        <ThemedText
          type="default"
          lightColor={lightColor}
          darkColor={darkColor}
          style={styles.text}
        >
          Последний вход: {formatDate(lastLogin)}
        </ThemedText>
      </View>
    );
  }
);

LastLoginInfo.displayName = 'LastLoginInfo';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default LastLoginInfo; 