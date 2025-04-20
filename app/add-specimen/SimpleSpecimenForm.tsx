import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Family, SectorType, LocationType, Exposition } from '@/types';
import { 
  BasicInfoSection, 
  LocationSection, 
  NotesSection,
} from './components';


// Импортируем новый Dropdown и типы для него
import { Dropdown } from '@/components/ui/Dropdown';
import { DropdownItem } from '@/components/ui/Dropdown/types';

// Совместимый тип для семейства в контексте выпадающего списка
type FamilyDropdownItem = {
  id: string | number;
  name: string;
  description?: string;
}

// Тип для экспозиции в контексте Dropdown
type ExpositionDropdownItem = {
  id: string | number;
  name: string;
  description?: string;
}

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
  mapId: string;
  setMapId: (value: string) => void;
  mapX: string;
  setMapX: (value: string) => void;
  mapY: string;
  setMapY: (value: string) => void;

  // Сектор
  sectorType: SectorType;
  setSectorType: (value: SectorType) => void;

  // Семейство
  familyId: string;
  setFamilyId: (value: string) => void;

  // Добавляем поля для экспозиции
  expositionId: string;
  setExpositionId: (value: string) => void;

  // Заметки
  description: string;
  setDescription: (value: string) => void;

  // Получение текущих координат
  getCurrentLocation: () => Promise<void>;
  
  // Данные семейств
  families: Family[];
  
  // Добавляем данные экспозиций
  expositions: Exposition[];
  
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
    locationType, setLocationType,
    mapId, setMapId,
    mapX, setMapX,
    mapY, setMapY,
    familyId, setFamilyId,
    expositionId, setExpositionId,
    description, setDescription,
    getCurrentLocation,
    families,
    expositions,
    errors
  } = form;
  
  

  // useEffect для получения координат оставляем
  useEffect(() => {
    // console.log('[SimpleSpecimenForm] Первый рендер - получаем координаты');
    getCurrentLocation();
  }, [getCurrentLocation]); // Добавляем getCurrentLocation в зависимости, если ESLint ругается

  // Преобразуем семейства в формат, подходящий для Dropdown
  const familyItems: FamilyDropdownItem[] = families.map(family => ({
    id: family.id.toString(),
    name: family.name,
    description: family.description
  }));

  // Преобразуем экспозиции в формат, подходящий для Dropdown
  const expositionItems: ExpositionDropdownItem[] = expositions.map(expo => ({
    id: expo.id.toString(),
    name: expo.name,
    description: expo.description
  }));

  // Новый обработчик выбора для универсального Dropdown
  const handleFamilySelect = useCallback((selectedFamily: DropdownItem) => {
    setFamilyId(selectedFamily.id.toString());
  }, [setFamilyId]);

  // Обработчик выбора экспозиции
  const handleExpositionSelect = useCallback((selectedExposition: DropdownItem) => {
    setExpositionId(selectedExposition.id.toString());
  }, [setExpositionId]);

  return (
    <View style={styles.formContainer}>
      {/* Базовая информация - используем стиль zIndex */}
      <View style={styles.zIndexHigh}>
        <BasicInfoSection
          inventoryNumber={inventoryNumber}
          setInventoryNumber={setInventoryNumber}
          russianName={russianName}
          setRussianName={setRussianName}
          latinName={latinName}
          setLatinName={setLatinName}
          // Передаем сам компонент Dropdown вместо пропсов для него
          familyDropdownComponent={(
            <Dropdown
              items={familyItems}
              selectedValue={familyId}
              onSelect={handleFamilySelect}
              label="Семейство"
              placeholder="Выберите семейство растения"
              leftIconName="leaf-outline"
              error={errors?.familyId}
              noDataMessage="Семейства не найдены"
            />
          )}
          expositionDropdownComponent={(
            <Dropdown
              items={expositionItems}
              selectedValue={expositionId}
              onSelect={handleExpositionSelect}
              label="Экспозиция"
              placeholder="Выберите экспозицию"
              leftIconName="map-outline"
              error={errors?.expositionId}
              noDataMessage="Экспозиции не найдены"
            />
          )}
          errors={errors}
        />
      </View>
      
      {/* Секция локации - используем стиль zIndex */}
      <View style={styles.zIndexMedium}>
        <LocationSection
          latitude={latitude}
          longitude={longitude}
          mapId={mapId}
          mapX={mapX}
          mapY={mapY}
          locationType={locationType}
          setLocationType={setLocationType}
          getCurrentLocation={getCurrentLocation}
          errors={errors}
        />
      </View>
      
      {/* Дополнительная информация - используем стиль zIndex */}
      <View style={styles.zIndexLow}>
        <NotesSection
          description={description}
          setDescription={setDescription}
          errors={errors}
        />
      </View>
    </View>
  );
});

export default SimpleSpecimenForm;
