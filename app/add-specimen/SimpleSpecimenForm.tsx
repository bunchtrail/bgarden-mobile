import React, { useEffect, useRef, memo, useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, TextInputProps, StyleProp, TextStyle, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { SectorType, LocationType, Family } from '@/types';
import { Colors } from '@/constants/Colors';

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
  
  // Данные семейств
  families: Family[];
  
  // Контроль выпадающего списка (из родительского компонента)
  dropdownVisible: boolean;
  setDropdownVisible: (visible: boolean) => void;
  
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
    families,
    dropdownVisible, setDropdownVisible,
    errors
  } = form;
  
  // Используем useRef для отслеживания первого вызова
  const isFirstRender = useRef(true);
  const familyInputRef = useRef<View>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownAnimation = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (dropdownVisible) {
      // Открываем выпадающий список с анимацией
      Animated.spring(dropdownAnimation, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40
      }).start();
      
      // Важно: измеряем положение при каждом открытии
      if (familyInputRef.current) {
        familyInputRef.current.measureInWindow((x, y, width, height) => {
          setDropdownPosition({
            top: y + height,
            left: x,
            width: width
          });
        });
      }
    } else {
      // Закрываем выпадающий список с анимацией
      Animated.spring(dropdownAnimation, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40
      }).start();
    }
  }, [dropdownVisible, dropdownAnimation]);

  const handleFamilySelect = (family: Family) => {
    setFamilyId(family.id.toString());
    setFamilyName(family.name);
    setDropdownVisible(false);
  };

  const toggleFamilyDropdown = () => {
    // Сначала получаем координаты
    if (familyInputRef.current) {
      familyInputRef.current.measureInWindow((x, y, width, height) => {
        console.log(`[SimpleSpecimenForm] Измерены координаты: x=${x}, y=${y}, width=${width}, height=${height}`);
        setDropdownPosition({
          top: y + height,
          left: x,
          width: width
        });
        
        // Затем переключаем видимость дропдауна
        setDropdownVisible(!dropdownVisible);
      });
    } else {
      console.log('[SimpleSpecimenForm] Ошибка: familyInputRef.current равен null');
      setDropdownVisible(!dropdownVisible);
    }
  };

  return (
    <>
      <View style={styles.formContainer}>
        {/* Базовая информация */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Основная информация</Text>
          <FormField
            label="Инвентарный номер"
            value={inventoryNumber}
            onChangeText={setInventoryNumber}
            error={errors?.inventoryNumber}
            placeholder="Введите или отсканируйте номер"
            leftIcon={<Ionicons name="barcode-outline" size={20} color={Colors.light.primary} />}
          />
          
          {/* Семейство */}
          <View style={[styles.fieldContainer, { position: 'relative', zIndex: 100 }]}>
            <Text style={styles.fieldLabel}>Семейство</Text>
            <View 
              ref={familyInputRef}
              collapsable={false} // Это важно для корректных измерений на Android
            >
              <TouchableOpacity
                style={[
                  styles.inputContainer,
                  styles.dropdownInput,
                  errors?.familyId ? styles.errorInput : null
                ]}
                onPress={toggleFamilyDropdown}
                activeOpacity={0.8}
              >
                <View style={styles.leftIcon}>
                  <Ionicons name="leaf-outline" size={20} color={Colors.light.primary} />
                </View>
                <Text style={[
                  styles.textInput, 
                  styles.inputWithIcon,
                  !familyName && styles.placeholderText
                ]}>
                  {familyName || 'Выберите семейство растения'}
                </Text>
                <Ionicons 
                  name={dropdownVisible ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={Colors.light.primary} 
                />
              </TouchableOpacity>
            </View>
            {errors?.familyId && <Text style={styles.errorText}>{errors.familyId}</Text>}
            
            {/* Выпадающий список прямо внутри контейнера семейства */}
            {dropdownVisible && (
              <Animated.View 
                style={[
                  styles.appleDropdown,
                  {
                    position: 'absolute',
                    top: '100%', // Размещаем прямо под элементом
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    opacity: dropdownAnimation,
                    transform: [{ 
                      scale: dropdownAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1]
                      }) 
                    }]
                  }
                ]}
              >
                {families && families.length > 0 ? (
                  <ScrollView
                    style={styles.dropdownList}
                    contentContainerStyle={styles.dropdownListContent}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {families.map((item, index) => (
                      <React.Fragment key={item.id.toString()}>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => handleFamilySelect(item)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.dropdownItemContent}>
                            <Text style={styles.dropdownItemText}>{item.name}</Text>
                            {item.description && (
                              <Text style={styles.dropdownItemDescription} numberOfLines={1}>
                                {item.description}
                              </Text>
                            )}
                          </View>
                          {familyId === item.id.toString() && (
                            <Ionicons name="checkmark" size={18} color={Colors.light.primary} />
                          )}
                        </TouchableOpacity>
                        {index < families.length - 1 && <View style={styles.dropdownSeparator} />}
                      </React.Fragment>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.noDataText}>Список семейств пуст</Text>
                )}
              </Animated.View>
            )}
          </View>
          
          {/* Названия растения */}
          <FormField
            label="Русское название"
            value={russianName}
            onChangeText={setRussianName}
            error={errors?.russianName}
            placeholder="Введите русское название растения"
            leftIcon={<Ionicons name="text-outline" size={20} color={Colors.light.primary} />}
          />
          
          <FormField
            label="Латинское название"
            value={latinName}
            onChangeText={setLatinName}
            error={errors?.latinName}
            placeholder="Введите латинское название растения"
            leftIcon={<Ionicons name="language-outline" size={20} color={Colors.light.primary} />}
          />
        </View>
        
        {/* Координаты */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Расположение</Text>
          <View style={styles.fieldContainer}>
            <View style={styles.locationHeader}>
              <Text style={styles.fieldLabel}>Координаты</Text>
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={getCurrentLocation}
              >
                <Ionicons name="locate" size={18} color={Colors.light.primary} />
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
        </View>
        
        {/* Заметки */}
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
      </View>
      
      {/* Добавляем перекрытие для закрытия дропдауна по клику вне списка */}
      {dropdownVisible && (
        <TouchableOpacity
          style={styles.dropdownBackdrop}
          onPress={() => setDropdownVisible(false)}
          activeOpacity={1}
        />
      )}
    </>
  );
});

// Вспомогательный компонент для полей формы - тоже мемоизируем
const FormField = memo(function FormFieldComponent({ label, value, onChangeText, error, leftIcon, style, ...props }: FormFieldProps & { style?: StyleProp<TextStyle> }) {
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
