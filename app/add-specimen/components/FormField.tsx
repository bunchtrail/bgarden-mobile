import React, { memo } from 'react';
import { TextInput, View, Text, StyleProp, TextStyle, TextInputProps } from 'react-native';
import { styles } from '../styles';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  onChangeText: (text: string) => void;
}

// Вспомогательный компонент для полей формы - мемоизируем
const FormField = memo(function FormFieldComponent({ 
  label, 
  value, 
  onChangeText, 
  error, 
  leftIcon, 
  style, 
  ...props 
}: FormFieldProps & { style?: StyleProp<TextStyle> }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.textInput, 
            error ? styles.errorInput : null,
            leftIcon ? styles.inputWithIcon : null,
            style
          ] as StyleProp<TextStyle>}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#9E9E9E"
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

export default FormField; 