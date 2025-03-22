import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface UserInfoProps {
  email?: string;
  position?: string;
  role?: number;
  lightColor?: string;
  darkColor?: string;
}

export const UserInfo: React.FC<UserInfoProps> = React.memo(
  ({ email, position, role, lightColor, darkColor }) => {
    const iconColor = useThemeColor({}, 'icon');
    
    const getRoleName = (roleId?: number): string => {
      if (!roleId) return '';
      
      switch (roleId) {
        case 1:
          return 'Администратор';
        case 2:
          return 'Сотрудник';
        case 3:
          return 'Пользователь';
        default:
          return 'Гость';
      }
    };

    type IoniconsName = keyof typeof Ionicons.glyphMap;

    const getRoleIcon = (roleId?: number): IoniconsName => {
      if (!roleId) return 'person-outline';
      
      switch (roleId) {
        case 1:
          return 'shield-outline';
        case 2:
          return 'briefcase-outline';
        case 3:
          return 'person-outline';
        default:
          return 'person-outline';
      }
    };

    if (!email && !position && role === undefined) {
      return null;
    }

    return (
      <View style={styles.container}>
        {email && (
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color={iconColor} style={styles.icon} />
            <ThemedText
              type="default"
              lightColor={lightColor}
              darkColor={darkColor}
              style={styles.infoText}
            >
              {email}
            </ThemedText>
          </View>
        )}
        
        {position && (
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={18} color={iconColor} style={styles.icon} />
            <ThemedText
              type="default"
              lightColor={lightColor}
              darkColor={darkColor}
              style={styles.infoText}
            >
              {position}
            </ThemedText>
          </View>
        )}
        
        {role !== undefined && (
          <View style={styles.infoRow}>
            <Ionicons name={getRoleIcon(role)} size={18} color={iconColor} style={styles.icon} />
            <ThemedText
              type="default"
              lightColor={lightColor}
              darkColor={darkColor}
              style={styles.infoText}
            >
              {getRoleName(role)}
            </ThemedText>
          </View>
        )}
      </View>
    );
  }
);

UserInfo.displayName = 'UserInfo';

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    width: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
});

export default UserInfo; 