import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { useAppNavigation } from '@/modules/navigation';
import { Button } from '@/components/Button';

interface AuthButtonProps {
  showLogin?: boolean;
  showRegister?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary';
  onLoginPress?: () => void;
  onRegisterPress?: () => void;
}

const AuthButton = ({
  showLogin = true,
  showRegister = false,
  style,
  variant = 'secondary',
  onLoginPress,
  onRegisterPress
}: AuthButtonProps) => {
  const { navigateTo } = useAppNavigation();
  
  const handleLoginPress = () => {
    if (onLoginPress) {
      onLoginPress();
    } else {
      navigateTo('LOGIN');
    }
  };
  
  const handleRegisterPress = () => {
    if (onRegisterPress) {
      onRegisterPress();
    } else {
      navigateTo('REGISTER');
    }
  };
  
  return (
    <View style={[styles.authContainer, style]}>
      {showLogin && (
        <Button
          title="Войти"
          onPress={handleLoginPress}
          variant={variant}
          style={styles.button}
        />
      )}
      
      {showRegister && (
        <Button
          title="Регистрация"
          onPress={handleRegisterPress}
          variant={variant === 'primary' ? 'secondary' : 'primary'}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
    width: '100%',
  },
  button: {
    width: '100%',
  },
});

export default AuthButton; 