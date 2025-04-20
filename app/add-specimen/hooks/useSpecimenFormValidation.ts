import { useCallback } from 'react';
import { LocationType } from '@/types';

interface ValidationForm {
  isSimpleMode?: boolean;
  inventoryNumber?: string;
  russianName?: string;
  latinName?: string;
  familyId?: string;
  expositionId?: string;
  description?: string;
  locationType?: LocationType;
  latitude?: string;
  longitude?: string;
  mapId?: string;
  mapX?: string;
  mapY?: string;
  setErrors: (errors: Record<string, string>) => void;
}

export const useSpecimenFormValidation = (form: ValidationForm) => {
  const {
    inventoryNumber,
    russianName,
    latinName,
    familyId,
    expositionId,
    description,
    locationType,
    latitude,
    longitude,
    mapId,
    mapX,
    mapY,
    setErrors
  } = form;
  
  const validateForm = useCallback(() => {
    const formErrors: Record<string, string> = {};
    let isValid = true;

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
      formErrors.familyId = 'Необходимо выбрать семейство';
      isValid = false;
    }

    if (!expositionId) {
      formErrors.expositionId = 'Необходимо выбрать экспозицию';
      isValid = false;
    }

    if (locationType === LocationType.Geographic) {
      if (!latitude) {
        formErrors.latitude = 'Необходимо указать широту';
        isValid = false;
      }
      if (!longitude) {
        formErrors.longitude = 'Необходимо указать долготу';
        isValid = false;
      }
    } else if (locationType === LocationType.SchematicMap) {
      if (!mapId) {
        formErrors.mapId = 'Необходимо указать ID карты';
        isValid = false;
      }
      if (!mapX) {
        formErrors.mapX = 'Необходимо указать X на карте';
        isValid = false;
      }
      if (!mapY) {
        formErrors.mapY = 'Необходимо указать Y на карте';
        isValid = false;
      }
    }

    if (!description) {
      formErrors.description = 'Необходимо ввести описание';
      isValid = false;
    }

    console.log('[Validation] Найденные ошибки:', formErrors);

    if (Object.keys(formErrors).length > 0 || !isValid) {
        setErrors(formErrors);
    } else {
        setErrors({});
    }
    
    return isValid;
  }, [
    inventoryNumber, russianName, latinName, familyId, expositionId, description,
    locationType, latitude, longitude, mapId, mapX, mapY,
    setErrors
  ]);

  return { validateForm };
};
