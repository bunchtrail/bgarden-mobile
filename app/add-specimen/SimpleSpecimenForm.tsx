import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Family, SectorType, LocationType } from '@/types';
import { 
  BasicInfoSection, 
  LocationSection, 
  NotesSection,
} from './components';


// Импортируем новый Dropdown
import { Dropdown } from '@/components/ui/Dropdown';

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
    description, setDescription,
    getCurrentLocation,
    families,
    errors
  } = form;
  
  

  // useEffect для получения координат оставляем
  useEffect(() => {
    // console.log('[SimpleSpecimenForm] Первый рендер - получаем координаты');
    getCurrentLocation();
  }, [getCurrentLocation]); // Добавляем getCurrentLocation в зависимости, если ESLint ругается

  // Новый обработчик выбора для универсального Dropdown
  const handleFamilySelect = useCallback((selectedFamily: Family) => {
    // selectedFamily теперь имеет тип Family (согласно DropdownItem)
    setFamilyId(selectedFamily.id.toString());
    // setFamilyName больше не нужен, имя будет браться из selectedFamily.name внутри Dropdown
  }, [setFamilyId]);



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
        // Передаем сам компонент Dropdown вместо пропсов для него
        familyDropdownComponent={(
          <Dropdown<Family>
            items={families} // Передаем список семейств
            selectedValue={familyId} // Передаем текущий ID
            onSelect={handleFamilySelect} // Передаем новый обработчик
            label="Семейство" // Заголовок поля
            placeholder="Выберите семейство растения" // Плейсхолдер
            leftIconName="leaf-outline" // Иконка
            error={errors?.familyId} // Ошибка
            noDataMessage="Семейства не найдены"
          />
        )}
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
