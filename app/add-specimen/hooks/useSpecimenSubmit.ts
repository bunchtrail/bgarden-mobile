import { useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { LocationType } from '@/types';

interface UseSpecimenSubmitProps {
  form: any; // Тип формы можно определить точнее
  validateForm: () => boolean;
}

export const useSpecimenSubmit = ({ form, validateForm }: UseSpecimenSubmitProps) => {
  const {
    inventoryNumber, sectorType, russianName, latinName, familyId,
    genus, species, cultivar, form: formValue, synonyms,
    plantingYear, hasHerbarium, expositionId, naturalRange,
    sampleOrigin, economicUse, ecologyAndBiology, conservationStatus,
    locationType, latitude, longitude, mapId, mapX, mapY,
    images, setLoading
  } = form;

  const handleSubmit = useCallback(async () => {
    console.log('[AddSpecimenScreen] Запуск обработчика отправки формы');

    // Валидация
    if (!validateForm()) {
      console.log('[AddSpecimenScreen] Форма не прошла валидацию, отправка отменена');
      return;
    }

    setLoading(true);
    console.log('[AddSpecimenScreen] Начало процесса сохранения образца');

    try {
      const specimenData: Record<string, string | number | boolean | undefined> = {
        inventoryNumber,
        sectorType,
        russianName: russianName || undefined,
        latinName: latinName || undefined,
        familyId: parseInt(familyId, 10),
        genus: genus || undefined,
        species: species || undefined,
        cultivar: cultivar || undefined,
        form: formValue || undefined,
        synonyms: synonyms || undefined,
        plantingYear: plantingYear ? parseInt(plantingYear, 10) : undefined,
        hasHerbarium,
        expositionId: expositionId ? parseInt(expositionId, 10) : undefined,
        naturalRange: naturalRange || undefined,
        sampleOrigin: sampleOrigin || undefined,
        economicUse: economicUse || undefined,
        ecologyAndBiology: ecologyAndBiology || undefined,
        conservationStatus: conservationStatus || undefined,
        locationType,
      };

      // Если указаны координаты
      if (locationType === LocationType.Geographic && latitude && longitude) {
        specimenData.latitude = parseFloat(latitude);
        specimenData.longitude = parseFloat(longitude);
      } else if (locationType === LocationType.SchematicMap && mapId && mapX && mapY) {
        specimenData.mapId = parseInt(mapId, 10);
        specimenData.mapX = parseFloat(mapX);
        specimenData.mapY = parseFloat(mapY);
      }

      // Здесь будет вызов API для сохранения образца
      // plantsApi.addSpecimen(specimenData);
      
      console.log('[AddSpecimenScreen] Образец успешно сохранен');
      Alert.alert('Успешно', 'Образец растения успешно добавлен в базу данных', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('[AddSpecimenScreen] Ошибка при добавлении образца:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при добавлении образца растения');
    } finally {
      console.log('[AddSpecimenScreen] Завершение процесса сохранения');
      setLoading(false);
    }
  }, [
    validateForm, setLoading, inventoryNumber, sectorType, russianName, 
    latinName, familyId, genus, species, cultivar, formValue, synonyms,
    plantingYear, hasHerbarium, expositionId, naturalRange, sampleOrigin,
    economicUse, ecologyAndBiology, conservationStatus, locationType,
    latitude, longitude, mapId, mapX, mapY, images,
  ]);

  return { handleSubmit };
}; 