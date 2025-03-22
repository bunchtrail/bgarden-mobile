import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  StyleProp, 
  ViewStyle, 
  TextStyle, 
  TouchableOpacity 
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  multiline?: boolean;
  maxLength?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onToggleSecureEntry?: () => void;
}

export const Input = React.memo(({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry,
  leftIcon,
  rightIcon,
  disabled = false,
  multiline = false,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  inputStyle,
  onToggleSecureEntry,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const errorColor = '#E53E3E';
  
  const containerBorderColor = error 
    ? errorColor 
    : isFocused 
      ? primaryColor 
      : borderColor;
  
  return (
    <View style={[styles.container, style]}>
      {label && (
        <ThemedText style={styles.label}>
          {label}
        </ThemedText>
      )}
      
      <View 
        style={[
          styles.inputContainer, 
          { 
            borderColor: containerBorderColor,
            backgroundColor,
            opacity: disabled ? 0.7 : 1,
          }
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input, 
            { color: textColor }, 
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            multiline ? styles.multilineInput : null,
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        
        {secureTextEntry !== undefined && onToggleSecureEntry && (
          <TouchableOpacity 
            style={styles.rightIcon} 
            onPress={onToggleSecureEntry}
            activeOpacity={0.7}
          >
            <ThemedText>
              {secureTextEntry ? '👁️' : '👁️‍🗨️'}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <ThemedText style={[styles.errorText, { color: errorColor }]}>
          {error}
        </ThemedText>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 4,
  },
  inputWithRightIcon: {
    paddingRight: 4,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  leftIcon: {
    paddingLeft: 12,
  },
  rightIcon: {
    paddingRight: 12,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
}); 