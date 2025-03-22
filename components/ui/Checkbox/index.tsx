import React from 'react';
import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: 'small' | 'medium' | 'large';
}

export const Checkbox = React.memo(({
  value,
  onValueChange,
  label,
  disabled = false,
  style,
  size = 'medium',
}: CheckboxProps) => {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');
  
  // Определение размеров в зависимости от пропса size
  const getSize = () => {
    switch (size) {
      case 'small':
        return { box: 16, checkmark: 10 };
      case 'large':
        return { box: 24, checkmark: 16 };
      case 'medium':
      default:
        return { box: 20, checkmark: 13 };
    }
  };
  
  const sizeValues = getSize();
  
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => !disabled && onValueChange(!value)}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            width: sizeValues.box,
            height: sizeValues.box,
            borderColor: disabled ? borderColor : value ? primaryColor : borderColor,
            backgroundColor: value ? (disabled ? `${primaryColor}80` : primaryColor) : backgroundColor,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {value && (
          <View
            style={[
              styles.checkmark,
              {
                width: sizeValues.checkmark,
                height: sizeValues.checkmark,
                borderColor: backgroundColor,
              },
            ]}
          />
        )}
      </View>
      
      {label && (
        <ThemedText style={[styles.label, { color: disabled ? `${textColor}80` : textColor }]}>
          {label}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
});

Checkbox.displayName = 'Checkbox';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    borderRightWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '45deg' }],
    marginBottom: 2,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
}); 