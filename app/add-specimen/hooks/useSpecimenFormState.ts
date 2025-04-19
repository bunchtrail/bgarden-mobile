import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SectorType, LocationType, Family, Exposition } from '@/types';
import { logWithTimestamp } from '../utils/logWithTimestamp';
import * as Location from 'expo-location';
import { plantsApi } from '@/modules/plants/services';

export function useSpecimenFormState() {
  // Получаем параметры URL
  const { sector = '' } = useLocalSearchParams<{ sector?: string }>();

  // Базовая информация
  const [inventoryNumber, setInventoryNumber] = useState(`INV-${Date.now()}`);
  const [russianName, setRussianName] = useState('');
  const [latinName, setLatinName] = useState('');
  const [genus, setGenus] = useState('');
  const [species, setSpecies] = useState('');
  const [sectorType, setSectorType] = useState<SectorType>(SectorType.Dendrology);

  // Местоположение
  const [locationType, setLocationType] = useState<LocationType>(LocationType.SchematicMap);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [mapId, setMapId] = useState('1'); // Устанавливаем ID карты по умолчанию
  const [mapX, setMapX] = useState('50'); // Устанавливаем координату X по умолчанию
  const [mapY, setMapY] = useState('50'); // Устанавливаем координату Y по умолчанию

  // Базовая таксономия
  const [familyId, setFamilyId] = useState('1');
  const [familyName, setFamilyName] = useState('');
  const [expositionId, setExpositionId] = useState<string>('1'); // Устанавливаем ID экспозиции по умолчанию

  // Упрощённый режим
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [careInstructions, setCareInstructions] = useState('');

  // Прочее
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [families, setFamilies] = useState<Family[]>([]);
  const [expositions, setExpositions] = useState<Exposition[]>([]);

  // Обработка параметра 'sector' при маунте/обновлении
  useEffect(() => {
    if (sector) {
      switch (sector) {
        case 'dendrology':
          setSectorType(SectorType.Dendrology);
          break;
        case 'flora':
          setSectorType(SectorType.Flora);
          break;
        case 'flowers':
          setSectorType(SectorType.Flowering);
          break;
        default:
          setSectorType(SectorType.Flora);
      }
    }
  }, [sector]);

  // Загрузка семейств при монтировании компонента
  useEffect(() => {
    const loadFamilies = async () => {
      try {
        setLoading(true);
        const response = await plantsApi.getFamilies();
        if (response.data) {
          setFamilies(response.data);
          if (response.data.length > 0) {
            setFamilyName(response.data[0].name);
          }
        } else if (response.error) {
          console.error('[FormState] Ошибка загрузки семейств:', response.error);
        }
      } catch (error) {
        console.error('[FormState] Ошибка при загрузке семейств:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFamilies();
  }, []);

  // Загрузка экспозиций при монтировании компонента
  useEffect(() => {
    const loadExpositions = async () => {
      try {
        setLoading(true);
        const response = await plantsApi.getExpositions();
        if (response.data) {
          setExpositions(response.data);
        } else if (response.error) {
          console.error('[FormState] Ошибка загрузки экспозиций:', response.error);
        }
      } catch (error) {
        console.error('[FormState] Ошибка при загрузке экспозиций:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExpositions();
  }, []);

  // Функция для получения текущих координат
  const getCurrentLocation = useCallback(async () => {
    // Если координаты уже есть и тип локации географический, не запрашиваем их снова
    if (latitude && longitude && locationType === LocationType.Geographic) {
      return;
    }

    // Если тип локации схематический, не запрашиваем географические координаты
    if (locationType === LocationType.SchematicMap) {
      return;
    }

    try {
      // Запрашиваем разрешение на доступ к геолокации
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        return;
      }
      
      // Устанавливаем тип локации как географические координаты
      setLocationType(LocationType.Geographic);
      
      // Получаем текущие координаты
      const location = await Location.getCurrentPositionAsync({});
      
      // Устанавливаем координаты только если они отличаются от текущих
      const newLatitude = location.coords.latitude.toString();
      const newLongitude = location.coords.longitude.toString();
      
      if (newLatitude !== latitude) {
        setLatitude(newLatitude);
      }
      
      if (newLongitude !== longitude) {
        setLongitude(newLongitude);
      }
    } catch (error) {
      console.error('[Location] Ошибка при получении координат:', error);
    }
  }, [latitude, longitude, locationType, mapId, mapX, mapY]);

  // Логируем, что смонтировались
  useEffect(() => {
    return () => {
    };
  }, []);

  return {
    // Параметры
    mode: 'simple',
    sector,
    isSimpleMode: true,

    // Стейт
    inventoryNumber, setInventoryNumber,
    russianName, setRussianName,
    latinName, setLatinName,
    genus, setGenus,
    species, setSpecies,
    sectorType, setSectorType,

    locationType, setLocationType,
    latitude, setLatitude,
    longitude, setLongitude,
    mapId, setMapId,
    mapX, setMapX,
    mapY, setMapY,

    familyId, setFamilyId,
    familyName, setFamilyName,
    expositionId, setExpositionId,

    description, setDescription,
    category, setCategory,
    location, setLocation,
    careInstructions, setCareInstructions,

    images, setImages,
    loading, setLoading,
    errors, setErrors,
    families,
    expositions,
    
    // Функция для получения геолокации
    getCurrentLocation,
  };
}
