import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { Colors } from '@/constants/Colors';
import FormField from './FormField';

interface NotesSectionProps {
  description: string;
  setDescription: (value: string) => void;
  errors: Record<string, string>;
}

export const NotesSection = memo(function NotesSectionComponent({
  description,
  setDescription,
  errors
}: NotesSectionProps) {
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Дополнительная информация</Text>
      <FormField
        label="Заметки"
        value={description}
        onChangeText={setDescription}
        error={errors?.description}
        placeholder="Введите заметки по растению"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={styles.multilineInput}
        leftIcon={<Ionicons name="create-outline" size={20} color={Colors.light.primary} />}
      />
    </View>
  );
}); 