import React from 'react';
import { View } from 'react-native';
import { Button } from '@/components/Button';
import { styles } from '../styles';

interface FormButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  loading: boolean;
}

export function FormButtons({ onCancel, onSave, loading }: FormButtonsProps) {
  return (
    <View style={styles.buttonsContainer}>
      <Button
        title="Отмена"
        onPress={onCancel}
        variant="secondary"
        style={styles.button}
        disabled={loading}
      />
      <Button
        title="Сохранить"
        onPress={onSave}
        variant="primary"
        style={styles.button}
        disabled={loading}
        loading={loading}
      />
    </View>
  );
} 

export default FormButtons;
