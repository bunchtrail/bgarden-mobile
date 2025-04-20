import { useCallback } from 'react';
import { LocationType } from '@/types';

// Обновляем интерфейс ValidationForm для соответствия полному состоянию
interface ValidationForm {
  inventoryNumber?: string;
  russianName?: string;
  latinName?: string;
  genus?: string;
  species?: string;
  cultivar?: string;
  form?: string;
  synonyms?: string;
  determinedBy?: string;
  plantingYear?: string;
  sampleOrigin?: string;
  naturalRange?: string;
  ecologyAndBiology?: string;
  economicUse?: string;
  conservationStatus?: string;
  hasHerbarium?: boolean;
  duplicatesInfo?: string;
  originalBreeder?: string;
  originalYear?: string;
  country?: string;
  locationType?: LocationType;
  latitude?: string;
  longitude?: string;
  mapId?: string;
  mapX?: string;
  mapY?: string;
  regionId?: string;
  familyId?: string;
  expositionId?: string;
  notes?: string; // Заменили description
  filledBy?: string;
  setErrors: (errors: Record<string, string>) => void;
}

const YEAR_REGEX = /^\d{4}$/;

export const useSpecimenFormValidation = (form: ValidationForm) => {
  // Деструктурируем все поля
  const {
    inventoryNumber,
    russianName,
    latinName,
    genus,
    species,
    cultivar,
    form: plantForm,
    synonyms,
    determinedBy,
    plantingYear,
    sampleOrigin,
    naturalRange,
    ecologyAndBiology,
    economicUse,
    conservationStatus,
    hasHerbarium,
    duplicatesInfo,
    originalBreeder,
    originalYear,
    country,
    locationType,
    latitude,
    longitude,
    mapId,
    mapX,
    mapY,
    regionId,
    familyId,
    expositionId,
    notes, // Заменили description
    filledBy,
    setErrors
  } = form;
  
  const validateForm = useCallback(() => {
    const formErrors: Record<string, string> = {};
    let isValid = true;

    // Обязательные поля
    if (!inventoryNumber) {
      formErrors.inventoryNumber = 'Необходимо указать инвентарный номер';
      isValid = false;
    }
    if (!russianName) {
      formErrors.russianName = 'Необходимо указать русское название';
      isValid = false;
    }
    if (!latinName) {
      formErrors.latinName = 'Необходимо указать латинское название';
      isValid = false;
    }
    if (!familyId) {
      formErrors.familyId = 'Необходимо выбрать семейство'; // В useSpecimenSubmit familyId обязателен
      isValid = false;
    }
    if (!expositionId) {
      formErrors.expositionId = 'Необходимо выбрать экспозицию';
      isValid = false;
    }

    // Валидация местоположения
    if (locationType === LocationType.Geographic) {
      if (!latitude) {
        formErrors.latitude = 'Необходимо указать широту';
        isValid = false;
      } else if (isNaN(parseFloat(latitude))) {
        formErrors.latitude = 'Широта должна быть числом';
        isValid = false;
      }
      if (!longitude) {
        formErrors.longitude = 'Необходимо указать долготу';
        isValid = false;
      } else if (isNaN(parseFloat(longitude))) {
        formErrors.longitude = 'Долгота должна быть числом';
        isValid = false;
      }
    } else if (locationType === LocationType.SchematicMap) {
      if (!mapId) {
        formErrors.mapId = 'Необходимо указать ID карты';
        isValid = false;
      } else if (isNaN(parseInt(mapId, 10))) {
         formErrors.mapId = 'ID карты должен быть числом';
         isValid = false;
      }
      if (!mapX) {
        formErrors.mapX = 'Необходимо указать X на карте';
        isValid = false;
      } else if (isNaN(parseFloat(mapX))) {
        formErrors.mapX = 'Координата X должна быть числом';
        isValid = false;
      }
      if (!mapY) {
        formErrors.mapY = 'Необходимо указать Y на карте';
        isValid = false;
      } else if (isNaN(parseFloat(mapY))) {
        formErrors.mapY = 'Координата Y должна быть числом';
        isValid = false;
      }
    }

    // Валидация годов (если введены)
    if (plantingYear && !YEAR_REGEX.test(plantingYear)) {
      formErrors.plantingYear = 'Год посадки должен состоять из 4 цифр';
      isValid = false;
    }
    if (originalYear && !YEAR_REGEX.test(originalYear)) {
      formErrors.originalYear = 'Год оригинатора должен состоять из 4 цифр';
      isValid = false;
    }

    // Валидация ID региона (если введен)
    if (regionId && isNaN(parseInt(regionId, 10))) {
      formErrors.regionId = 'ID региона должен быть числом';
      isValid = false;
    }
    
    // Удалена валидация description, notes опциональны

    console.log('[Validation] Найденные ошибки:', formErrors);

    setErrors(formErrors);
    
    return isValid;
  }, [
    // Добавляем все поля в зависимости
    inventoryNumber, russianName, latinName, genus, species, cultivar, plantForm,
    synonyms, determinedBy, plantingYear, sampleOrigin, naturalRange, ecologyAndBiology,
    economicUse, conservationStatus, hasHerbarium, duplicatesInfo, originalBreeder,
    originalYear, country, locationType, latitude, longitude, mapId, mapX, mapY,
    regionId, familyId, expositionId, notes, filledBy,
    setErrors
  ]);

  return { validateForm };
};

export default useSpecimenFormValidation;

