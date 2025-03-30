import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { styles } from './styles';

interface SpecimenFormData {
  russianName: string;
  setRussianName: (value: string) => void;
  latinName: string;
  setLatinName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  careInstructions: string;
  setCareInstructions: (value: string) => void;
  errors: Record<string, string>;
}

interface SimpleSpecimenFormProps {
  form: SpecimenFormData;
}

export function SimpleSpecimenForm({ form }: SimpleSpecimenFormProps) {
  const {
    russianName, setRussianName,
    latinName, setLatinName,
    description, setDescription,
    category, setCategory,
    location, setLocation,
    careInstructions, setCareInstructions,
    errors
  } = form;

  return (
    <View style={styles.formContainer}>
      <FormField
        label="Русское название"
        value={russianName}
        onChangeText={setRussianName}
        error={errors?.russianName}
        placeholder="Введите русское название растения"
      />
      
      <FormField
        label="Латинское название"
        value={latinName}
        onChangeText={setLatinName}
        error={errors?.latinName}
        placeholder="Введите латинское название растения"
      />
      
      <FormField
        label="Описание"
        value={description}
        onChangeText={setDescription}
        error={errors?.description}
        placeholder="Опишите растение"
        multiline
      />
      
      <FormField
        label="Категория"
        value={category}
        onChangeText={setCategory}
        error={errors?.category}
        placeholder="Выберите категорию растения"
      />
      
      <FormField
        label="Местоположение"
        value={location}
        onChangeText={setLocation}
        error={errors?.location}
        placeholder="Укажите местоположение растения"
      />
      
      <FormField
        label="Инструкции по уходу"
        value={careInstructions}
        onChangeText={setCareInstructions}
        error={errors?.careInstructions}
        placeholder="Укажите инструкции по уходу"
        multiline
      />
    </View>
  );
}

// Вспомогательный компонент для полей формы
function FormField({ label, value, onChangeText, error, ...props }: any) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, error && styles.errorInput]}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
