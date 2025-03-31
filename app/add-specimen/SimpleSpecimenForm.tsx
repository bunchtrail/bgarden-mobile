import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { View, Animated } from 'react-native';
import { styles } from './styles';
import { Family, SectorType, LocationType } from '@/types';
import { 
  BasicInfoSection, 
  LocationSection, 
  NotesSection,
  FormField,
  FamilyDropdown 
} from './components';
import { useAnimation, useDropdownPosition } from './hooks';

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
  
  // Ошибки
  errors: Record<string, string>;
}

interface SimpleSpecimenFormProps {
  form: SpecimenFormData;
}

// Мемоизируем компонент для предотвращения ненужных перерендеров
export const SimpleSpecimenForm = memo(function SimpleSpecimenFormComponent({ form }: SimpleSpecimenFormProps) {
  const {
    inventoryNumber, setInventoryNumber,
    russianName, setRussianName,
    latinName, setLatinName,
    latitude, setLatitude,
    longitude, setLongitude,
    familyId, setFamilyId,
    familyName, setFamilyName,
    description, setDescription,
    getCurrentLocation,
    families,
    errors
  } = form;
  
  // Используем кастомные хуки для управления выпадающим списком и анимацией
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const familyInputRef = useRef<View>(null);
  
  // Используем хуки и сохраняем ссылки на них через useRef
  const animationManager = useAnimation();
  const dropdownAnimation = animationManager.animation;
  const animationRef = useRef(animationManager);
  
  const positionManager = useDropdownPosition(familyInputRef);
  const dropdownPosition = positionManager.dropdownPosition;
  const positionRef = useRef(positionManager);
  
  // Обновляем ссылки при каждом рендере
  useEffect(() => {
    animationRef.current = animationManager;
    positionRef.current = positionManager;
  });
  
  // Используем isFirstRender через useRef для правильного отслеживания первого рендера
  const isFirstRender = useRef(true);

  // Обработка открытия/закрытия выпадающего списка
  useEffect(() => {
    if (dropdownVisible) {
      animationRef.current.animateOpen();
      positionRef.current.measurePosition();
    } else {
      animationRef.current.animateClose();
    }
  }, [dropdownVisible]); // Удаляем animationManager и positionManager из зависимостей
  
  // Получаем координаты только при первом монтировании компонента
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      console.log('[SimpleSpecimenForm] Первый рендер - получаем координаты');
      getCurrentLocation();
    }
  }, []);  // Удаляем getCurrentLocation из зависимостей, т.к. он используется только один раз

  // Обработчики для выпадающего списка
  const handleFamilySelect = useCallback((family: Family) => {
    setFamilyId(family.id.toString());
    setFamilyName(family.name);
    setDropdownVisible(false);
  }, [setFamilyId, setFamilyName]);

  const toggleFamilyDropdown = useCallback(() => {
    positionRef.current.measurePosition();
    setDropdownVisible(prev => !prev);
  }, []);

  return (
    <View style={styles.formContainer}>
      {/* Базовая информация */}
      <BasicInfoSection
        inventoryNumber={inventoryNumber}
        setInventoryNumber={setInventoryNumber}
        russianName={russianName}
        setRussianName={setRussianName}
        latinName={latinName}
        setLatinName={setLatinName}
        familyId={familyId}
        setFamilyId={setFamilyId}
        familyName={familyName}
        setFamilyName={setFamilyName}
        families={families}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
        dropdownPosition={dropdownPosition}
        dropdownAnimation={dropdownAnimation}
        toggleFamilyDropdown={toggleFamilyDropdown}
        handleFamilySelect={handleFamilySelect}
        familyInputRef={familyInputRef}
        errors={errors}
      />
      
      {/* Секция локации */}
      <LocationSection
        latitude={latitude}
        longitude={longitude}
        getCurrentLocation={getCurrentLocation}
        errors={errors}
      />
      
      {/* Дополнительная информация */}
      <NotesSection
        description={description}
        setDescription={setDescription}
        errors={errors}
      />
    </View>
  );
});
