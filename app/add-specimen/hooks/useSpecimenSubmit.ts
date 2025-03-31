import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { LocationType, SectorType } from '@/types';
import { plantsApi } from '@/modules/plants/services';

interface SpecimenFormData {
  inventoryNumber: string;
  russianName: string;
  latinName: string;
  familyId: string;
  description: string;
  locationType: LocationType;
  latitude: string;
  longitude: string;
  mapId: string;
  mapX: string;
  mapY: string;
  sectorType: SectorType;
}

interface UseSpecimenSubmit {
  submitSpecimen: () => Promise<void>;
  loading: boolean;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

export function useSpecimenSubmit(formData: SpecimenFormData, setLoading: (loading: boolean) => void): UseSpecimenSubmit {
  const { 
    inventoryNumber, 
    russianName, 
    latinName, 
    familyId, 
    description,
    locationType,
    latitude,
    longitude,
    mapId,
    mapX,
    mapY,
    sectorType
  } = formData;
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!inventoryNumber) {
      errors.inventoryNumber = 'Необходимо указать инвентарный номер';
    }

    if (!familyId) {
      errors.familyId = 'Необходимо выбрать семейство';
    }

    if (!russianName && !latinName) {
      errors.russianName = 'Укажите хотя бы одно название растения';
      errors.latinName = 'Укажите хотя бы одно название растения';
    }

    // Проверка координат в зависимости от типа локации
    if (locationType === LocationType.Geographic) {
      if (!latitude || !longitude) {
        errors.latitude = 'Необходимо указать координаты';
      }
    } else if (locationType === LocationType.SchematicMap) {
      if (!mapId || !mapX || !mapY) {
        errors.latitude = 'Необходимо указать координаты на карте';
      }
    }

    return errors;
  }, [inventoryNumber, familyId, russianName, latinName, locationType, latitude, longitude, mapId, mapX, mapY]);

  const submitSpecimen = useCallback(async () => {
    // Валидация перед отправкой
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Сброс ошибок
    setErrors({});
    
    try {
      setLoading(true);
      
      // Подготовка данных о координатах в зависимости от типа локации
      const locationData = locationType === LocationType.Geographic 
        ? {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            locationType
          }
        : {
            mapId: parseInt(mapId, 10),
            mapX: parseFloat(mapX),
            mapY: parseFloat(mapY),
            locationType
          };
      
      // Формирование данных для отправки
      const specimenData = {
        inventoryNumber,
        russianName: russianName || undefined,
        latinName: latinName || undefined,
        familyId: parseInt(familyId, 10),
        description: description || undefined,
        sectorType,
        ...locationData
      };
      
      console.log('[SpecimenSubmit] Отправка данных:', specimenData);
      
      // Отправка на сервер
      const response = await plantsApi.createSpecimen(specimenData);
      
      if (response.error) {
        Alert.alert('Ошибка', `Не удалось сохранить растение: ${response.error}`);
        console.error('[SpecimenSubmit] Ошибка сохранения:', response.error);
        return;
      }
      
      if (response.data) {
        console.log('[SpecimenSubmit] Растение сохранено с ID:', response.data.id);
        Alert.alert('Успешно', 'Растение успешно добавлено', [
          { 
            text: 'OK', 
            onPress: () => router.push('/') 
          }
        ]);
      }
    } catch (error) {
      console.error('[SpecimenSubmit] Ошибка:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при сохранении растения');
    } finally {
      setLoading(false);
    }
  }, [
    inventoryNumber, 
    russianName, 
    latinName, 
    familyId, 
    description, 
    sectorType, 
    locationType,
    latitude,
    longitude,
    mapId,
    mapX,
    mapY,
    setLoading, 
    validateForm, 
    setErrors
  ]);

  return {
    submitSpecimen,
    loading: false,
    errors,
    setErrors,
  };
} 