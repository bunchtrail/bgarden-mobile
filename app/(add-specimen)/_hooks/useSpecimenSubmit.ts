import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { LocationType, SectorType, Exposition } from '@/types';
import { plantsApi, specimenImagesApi } from '@/modules/plants/services';

interface SpecimenFormData {
  inventoryNumber: string;
  russianName: string;
  latinName: string;
  familyId: string;
  expositionId: string;
  description: string;
  locationType: LocationType;
  latitude: string;
  longitude: string;
  mapId: string;
  mapX: string;
  mapY: string;
  sectorType: SectorType;
}

interface UseSpecimenSubmitProps {
  formData: SpecimenFormData;
  setLoading: (loading: boolean) => void;
  images: string[];
}

interface UseSpecimenSubmitResult {
  submitSpecimen: () => Promise<void>;
  loading: boolean;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

export function useSpecimenSubmit({ 
  formData, 
  setLoading, 
  images 
}: UseSpecimenSubmitProps): UseSpecimenSubmitResult {
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
    sectorType
  } = formData;
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitSpecimen = useCallback(async () => {
    setErrors({});
    
    let createdSpecimenId: number | null = null;

    try {
      setLoading(true);
      
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
      
      const specimenData = {
        inventoryNumber,
        russianName: russianName || undefined,
        latinName: latinName || undefined,
        familyId: parseInt(familyId, 10),
        description: description || undefined,
        sectorType,
        expositionId: expositionId ? parseInt(expositionId, 10) : undefined,
        ...locationData
      };
      
      console.log('[SpecimenSubmit] Отправка данных:', specimenData);
      
      const response = await plantsApi.createSpecimen(specimenData);
      
      if (response.error) {
        Alert.alert('Ошибка', `Не удалось сохранить растение: ${response.error}`);
        console.error('[SpecimenSubmit] Ошибка сохранения:', response.error);
        setLoading(false);
        return;
      }
      
      if (response.data) {
        createdSpecimenId = response.data.id;
        console.log('[SpecimenSubmit] Растение сохранено с ID:', createdSpecimenId);
        
        if (createdSpecimenId && images && images.length > 0) {
          console.log(`[SpecimenSubmit] Загрузка ${images.length} изображений для ID: ${createdSpecimenId}`);
          
          try {
            const uploadResult = await specimenImagesApi.batchUpload(
              createdSpecimenId, 
              images,
              true
            );

            if (uploadResult?.data === null && uploadResult?.error) {
              console.error('[SpecimenSubmit] Ошибка ответа при загрузке изображений:', uploadResult.error);
              Alert.alert('Предупреждение', `Растение создано, но не удалось загрузить изображения: ${uploadResult.error}`);
            } else if (uploadResult?.data && uploadResult.data.errorCount > 0) {
              console.error('[SpecimenSubmit] Ошибка загрузки изображений (внутри данных):', uploadResult.data.errorMessages);
              Alert.alert('Предупреждение', `Растение создано, но не удалось загрузить изображения: ${uploadResult.data.errorMessages?.join(', ')}`);
            } else if (uploadResult?.data && uploadResult.data.successCount > 0) {
              console.log(`[SpecimenSubmit] Успешно загружено ${uploadResult.data.successCount} изображений.`);
            } else {
               console.warn('[SpecimenSubmit] Загрузка изображений не вернула данных об успехе или ошибках.', uploadResult);
            }

          } catch (uploadError) {
            console.error('[SpecimenSubmit] Критическая ошибка при вызове batchUpload:', uploadError);
            Alert.alert('Предупреждение', 'Растение создано, но произошла ошибка при загрузке изображений.');
          }
        } 
        
        Alert.alert('Успешно', 'Растение успешно добавлено', [
          { 
            text: 'OK', 
            onPress: () => router.push('/') 
          }
        ]);
        
      } else {
         console.warn('[SpecimenSubmit] Растение создано, но ответ не содержит данных.');
         Alert.alert('Внимание', 'Растение создано, но сервер не вернул данные.');
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
    expositionId,
    description, 
    sectorType, 
    locationType,
    latitude,
    longitude,
    mapId,
    mapX,
    mapY,
    setLoading, 
    setErrors,
    images
  ]);

  return {
    submitSpecimen,
    loading: false,
    errors,
    setErrors,
  };
} 

export default useSpecimenSubmit;
