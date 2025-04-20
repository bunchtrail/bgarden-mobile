import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Family, SectorType, LocationType, Exposition } from '@/types';
import { 
  BasicInfoSection, 
  LocationSection, 
  NotesSection,
} from './_components';
import { useSpecimenFormState } from './_hooks/useSpecimenFormState'; // Импорт типа хука

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

// Используем ReturnType для автоматического получения типа из хука
type SpecimenFormData = ReturnType<typeof useSpecimenFormState>;

interface SimpleSpecimenFormProps {
  form: SpecimenFormData;
}

// Мемоизируем компонент для предотвращения ненужных перерендеров
export const SimpleSpecimenForm = memo(function SimpleSpecimenFormComponent({ form }: SimpleSpecimenFormProps) {
  // Деструктурируем все поля из form
  const {
    // Базовая инфо
    inventoryNumber, setInventoryNumber,
    russianName, setRussianName,
    latinName, setLatinName,
    genus, setGenus,
    species, setSpecies,
    cultivar, setCultivar,
    form: plantForm, setForm: setPlantForm, // Используем plantForm из-за конфликта имен
    synonyms, setSynonyms,
    determinedBy, setDeterminedBy,
    plantingYear, setPlantingYear,
    sampleOrigin, setSampleOrigin,
    naturalRange, setNaturalRange,
    ecologyAndBiology, setEcologyAndBiology,
    economicUse, setEconomicUse,
    conservationStatus, setConservationStatus,
    hasHerbarium, setHasHerbarium,
    duplicatesInfo, setDuplicatesInfo,
    originalBreeder, setOriginalBreeder,
    originalYear, setOriginalYear,
    country, setCountry,
    // Локация
    locationType, setLocationType,
    latitude, setLatitude, // setLatitude не используется в LocationSection напрямую
    longitude, setLongitude, // setLongitude не используется в LocationSection напрямую
    mapId, setMapId,
    mapX, setMapX,
    mapY, setMapY,
    regionId, setRegionId,
    // Таксономия
    familyId, setFamilyId,
    expositionId, setExpositionId,
    // Заметки и заполнение
    notes, setNotes, // Заменяем description
    filledBy, setFilledBy,
    // Вспомогательные
    getCurrentLocation,
    families,
    expositions,
    errors
  } = form;

  // useEffect для получения координат оставляем
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

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

  // Обработчики выбора для Dropdown
  const handleFamilySelect = useCallback((selectedFamily: DropdownItem) => {
    setFamilyId(selectedFamily.id.toString());
  }, [setFamilyId]);

  const handleExpositionSelect = useCallback((selectedExposition: DropdownItem) => {
    setExpositionId(selectedExposition.id.toString());
  }, [setExpositionId]);

  return (
    <View style={styles.formContainer}>
      {/* Базовая информация */}
      <View style={styles.zIndexHigh}>
        <BasicInfoSection
          // Основные поля
          inventoryNumber={inventoryNumber}
          setInventoryNumber={setInventoryNumber}
          russianName={russianName}
          setRussianName={setRussianName}
          latinName={latinName}
          setLatinName={setLatinName}
          // Дополнительные поля
          genus={genus}
          setGenus={setGenus}
          species={species}
          setSpecies={setSpecies}
          cultivar={cultivar}
          setCultivar={setCultivar}
          form={plantForm} // Используем переименованное поле
          setForm={setPlantForm} // Используем переименованный сеттер
          synonyms={synonyms}
          setSynonyms={setSynonyms}
          determinedBy={determinedBy}
          setDeterminedBy={setDeterminedBy}
          plantingYear={plantingYear}
          setPlantingYear={setPlantingYear}
          sampleOrigin={sampleOrigin}
          setSampleOrigin={setSampleOrigin}
          naturalRange={naturalRange}
          setNaturalRange={setNaturalRange}
          ecologyAndBiology={ecologyAndBiology}
          setEcologyAndBiology={setEcologyAndBiology}
          economicUse={economicUse}
          setEconomicUse={setEconomicUse}
          conservationStatus={conservationStatus}
          setConservationStatus={setConservationStatus}
          hasHerbarium={hasHerbarium}
          setHasHerbarium={setHasHerbarium}
          duplicatesInfo={duplicatesInfo}
          setDuplicatesInfo={setDuplicatesInfo}
          originalBreeder={originalBreeder}
          setOriginalBreeder={setOriginalBreeder}
          originalYear={originalYear}
          setOriginalYear={setOriginalYear}
          country={country}
          setCountry={setCountry}
          // Дропдауны
          familyDropdownComponent={(
            <Dropdown
              items={familyItems}
              selectedValue={familyId}
              onSelect={handleFamilySelect}
              label="Семейство"
              placeholder="Выберите семейство"
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
              leftIconName="images-outline" // Иконка для экспозиции
              error={errors?.expositionId}
              noDataMessage="Экспозиции не найдены"
            />
          )}
          errors={errors}
        />
      </View>
      
      {/* Секция локации */}
      <View style={styles.zIndexMedium}>
        <LocationSection
          // Основные поля
          latitude={latitude} // Только для отображения
          longitude={longitude} // Только для отображения
          mapId={mapId}
          setMapId={setMapId}
          mapX={mapX}
          setMapX={setMapX}
          mapY={mapY}
          setMapY={setMapY}
          locationType={locationType}
          setLocationType={setLocationType}
          getCurrentLocation={getCurrentLocation}
          // Дополнительные поля
          regionId={regionId}
          setRegionId={setRegionId}
          errors={errors}
        />
      </View>
      
      {/* Заметки и информация */}
      <View style={styles.zIndexLow}>
        <NotesSection
          notes={notes} // Используем notes
          setNotes={setNotes} // Используем setNotes
          filledBy={filledBy}
          setFilledBy={setFilledBy}
          errors={errors}
        />
      </View>
    </View>
  );
});

export default SimpleSpecimenForm;
