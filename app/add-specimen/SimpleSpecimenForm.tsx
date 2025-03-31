import React, { useEffect, useRef, memo } from 'react';
import { TextInput, View, Text, TouchableOpacity, TextInputProps, StyleProp, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { SectorType, LocationType } from '@/types';

interface SpecimenFormData {
  // Базовые поля
  inventoryNumber: string;
  setInventoryNumber: (value: string) => void;
  russianName: string;
  setRussianName: (value: string) => void;
  latinName: string;
  setLatinName: (value: string) => void;

  // Локация
  locationType: LocationType;
  setLocationType: (value: LocationType) => void;
  latitude: string;
  setLatitude: (value: string) => void;
  longitude: string;
  setLongitude: (value: string) => void;

  // Сектор
  sectorType: SectorType;
  setSectorType: (value: SectorType) => void;

  // Семейство
  familyId: string;
  setFamilyId: (value: string) => void;
  familyName: string;
  setFamilyName: (value: string) => void;

  // Заметки
  description: string;
  setDescription: (value: string) => void;

  // Получение текущих координат
  getCurrentLocation: () => Promise<void>;
  
  // Ошибки
  errors: Record<string, string>;
}

interface SimpleSpecimenFormProps {
  form: SpecimenFormData;
}

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  onChangeText: (text: string) => void;
}

// Мемоизируем компонент для предотвращения ненужных перерендеров
export const SimpleSpecimenForm = memo(function SimpleSpecimenFormComponent({ form }: SimpleSpecimenFormProps) {
  const {
    inventoryNumber, setInventoryNumber,
    russianName, setRussianName,
    latinName, setLatinName,
    locationType, setLocationType,
    latitude, setLatitude,
    longitude, setLongitude,
    sectorType, setSectorType,
    familyId, setFamilyId,
    familyName, setFamilyName,
    description, setDescription,
    getCurrentLocation,
    errors
  } = form;
  
  // Используем useRef для отслеживания первого вызова
  const isFirstRender = useRef(true);

  // Получаем координаты только при первом монтировании компонента
  useEffect(() => {
    // Проверяем, что это первый рендер
    if (isFirstRender.current) {
      // Устанавливаем флаг, что первый рендер уже был
      isFirstRender.current = false;
      
      console.log('[SimpleSpecimenForm] Первый рендер - получаем координаты');
      // Устанавливаем тип локации и получаем текущие координаты
      getCurrentLocation();
    }
  }, []);

  return (
    <View style={styles.formContainer}>
      <FormField
        label="Инвентарный номер"
        value={inventoryNumber}
        onChangeText={setInventoryNumber}
        error={errors?.inventoryNumber}
        placeholder="Введите или отсканируйте номер"
        leftIcon={<Ionicons name="barcode-outline" size={20} color="#333" />}
      />
      
      {/* Семейство */}
      <FormField
        label="Семейство"
        value={familyId}
        onChangeText={setFamilyId}
        error={errors?.familyId}
        placeholder="Выберите семейство растения"
        leftIcon={<Ionicons name="leaf-outline" size={20} color="#333" />}
      />
      
      {/* Названия растения */}
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
      
      {/* Координаты */}
      <View style={styles.fieldContainer}>
        <View style={styles.locationHeader}>
          <Text style={styles.fieldLabel}>Координаты</Text>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <Ionicons name="locate" size={20} color="#007BFF" />
            <Text style={styles.locationButtonText}>Получить GPS</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.coordinatesContainer}>
          <View style={[styles.coordinateField, { marginRight: 8 }]}>
            <Text style={styles.coordinateLabel}>Широта:</Text>
            <Text style={styles.coordinateValue}>{latitude || 'Нет данных'}</Text>
          </View>
          <View style={styles.coordinateField}>
            <Text style={styles.coordinateLabel}>Долгота:</Text>
            <Text style={styles.coordinateValue}>{longitude || 'Нет данных'}</Text>
          </View>
        </View>
        {errors?.latitude && <Text style={styles.errorText}>{errors.latitude}</Text>}
      </View>
      
      {/* Заметки */}
      <FormField
        label="Заметки"
        value={description}
        onChangeText={setDescription}
        error={errors?.description}
        placeholder="Введите заметки по растению"
        multiline
      />
    </View>
  );
});

// Вспомогательный компонент для полей формы - тоже мемоизируем
const FormField = memo(function FormFieldComponent({ label, value, onChangeText, error, leftIcon, ...props }: FormFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.textInput, 
            error ? styles.errorInput : null,
            leftIcon ? styles.inputWithIcon : null
          ] as StyleProp<TextStyle>}
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});
