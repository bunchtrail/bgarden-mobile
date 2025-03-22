import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'card');
  const secondaryTextColor = useThemeColor({}, 'text');

  const buttonStyle = [
    styles.button,
    variant === 'primary' 
      ? { backgroundColor: primaryColor } 
      : { backgroundColor: secondaryColor, borderWidth: 1, borderColor: secondaryTextColor },
    disabled && { opacity: 0.6 },
    style,
  ];

  const textStyle = [
    styles.text,
    variant === 'primary' 
      ? { color: textColor } 
      : { color: secondaryTextColor },
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? textColor : secondaryTextColor} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 