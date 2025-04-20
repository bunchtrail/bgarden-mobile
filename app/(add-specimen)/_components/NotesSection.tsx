import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { Colors } from '@/constants/Colors';
import FormField from './FormField';

interface NotesSectionProps {
  notes: string;
  setNotes: (value: string) => void;
  filledBy: string;
  setFilledBy: (value: string) => void;
  errors: Record<string, string>;
}

export const NotesSection = memo(function NotesSectionComponent({
  notes,
  setNotes,
  filledBy,
  setFilledBy,
  errors
}: NotesSectionProps) {
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Заметки и информация</Text>
      <FormField
        label="Заметки"
        value={notes}
        onChangeText={setNotes}
        error={errors?.notes}
        placeholder="Введите заметки по растению"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={styles.multilineInput}
        leftIcon={<Ionicons name="create-outline" size={20} color={Colors.light.primary} />}
      />
      <TouchableOpacity 
        style={styles.advancedButton} 
        onPress={() => setShowAdvanced(!showAdvanced)}
      >
        <Text style={styles.advancedButtonText}>
          {showAdvanced ? 'Скрыть дополнительные поля' : 'Показать дополнительные поля'}
        </Text>
        <Ionicons 
          name={showAdvanced ? "chevron-up-outline" : "chevron-down-outline"} 
          size={20} 
          color={Colors.light.primary} 
        />
      </TouchableOpacity>
      {showAdvanced && (
        <View style={{ marginTop: 15 }}>
           <FormField
            label="Заполнил"
            value={filledBy}
            onChangeText={setFilledBy}
            error={errors?.filledBy}
            placeholder="ФИО заполнившего (если не текущий пользователь)"
            leftIcon={<Ionicons name="person-add-outline" size={20} color={Colors.light.primary} />}
          />
        </View>
      )}
    </View>
  );
}); 

export default NotesSection;
