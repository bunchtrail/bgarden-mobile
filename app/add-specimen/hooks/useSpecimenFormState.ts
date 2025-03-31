import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SectorType, LocationType, Family } from '@/types';
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
          console.log(`[FormState] Загружено ${response.data.length} семейств`);
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

  // Функция для получения текущих координат
  const getCurrentLocation = useCallback(async () => {
    // Если координаты уже есть и тип локации географический, не запрашиваем их снова
    if (latitude && longitude && locationType === LocationType.Geographic) {
      console.log(`[Location] Используем существующие координаты: ${latitude}, ${longitude}`);
      return;
    }

    // Если тип локации схематический, не запрашиваем географические координаты
    if (locationType === LocationType.SchematicMap) {
      console.log(`[Location] Используем схематические координаты: mapId=${mapId}, x=${mapX}, y=${mapY}`);
      return;
    }

    try {
      // Запрашиваем разрешение на доступ к геолокации
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('[Location] Разрешение на геолокацию не предоставлено');
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
      
      console.log(`[Location] Получены координаты: ${location.coords.latitude}, ${location.coords.longitude}`);
    } catch (error) {
      console.error('[Location] Ошибка при получении координат:', error);
    }
  }, [latitude, longitude, locationType, mapId, mapX, mapY]);

  // Логируем, что смонтировались
  useEffect(() => {
    logWithTimestamp('[AddSpecimenScreen] Компонент смонтирован');
    return () => {
      logWithTimestamp('[AddSpecimenScreen] Компонент размонтирован');
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

    description, setDescription,
    category, setCategory,
    location, setLocation,
    careInstructions, setCareInstructions,

    images, setImages,
    loading, setLoading,
    errors, setErrors,
    families,
    
    // Функция для получения геолокации
    getCurrentLocation,
  };
}
