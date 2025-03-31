import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SectorType, LocationType } from '@/types';
import { logWithTimestamp } from '../utils/logWithTimestamp';
import * as Location from 'expo-location';

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
  const [locationType, setLocationType] = useState<LocationType>(LocationType.None);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [mapId, setMapId] = useState('');
  const [mapX, setMapX] = useState('');
  const [mapY, setMapY] = useState('');

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

  // Функция для получения текущих координат
  const getCurrentLocation = useCallback(async () => {
    // Если координаты уже есть, не запрашиваем их снова
    if (latitude && longitude && locationType === LocationType.Geographic) {
      console.log(`[Location] Используем существующие координаты: ${latitude}, ${longitude}`);
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
  }, [latitude, longitude, locationType]);

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
    
    // Функция для получения геолокации
    getCurrentLocation,
  };
}
