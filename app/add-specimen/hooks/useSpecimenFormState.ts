import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SectorType, LocationType } from '@/types';
import { logWithTimestamp } from '../utils/logWithTimestamp';

type ModeType = 'simple' | 'full';

export function useSpecimenFormState() {
  // Получаем параметры URL
  const { mode = 'full', sector = '' } = useLocalSearchParams<{ mode?: ModeType; sector?: string }>();

  // Определяем упрощённый или полный режим
  const isSimpleMode = mode === 'simple';

  // Базовая информация
  const [inventoryNumber, setInventoryNumber] = useState(isSimpleMode ? `INV-${Date.now()}` : '');
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

  // Таксономия
  const [familyId, setFamilyId] = useState('1');
  const [familyName, setFamilyName] = useState('');
  const [cultivar, setCultivar] = useState('');
  const [form, setForm] = useState('');
  const [synonyms, setSynonyms] = useState('');

  // Доп. информация
  const [plantingYear, setPlantingYear] = useState('');
  const [hasHerbarium, setHasHerbarium] = useState(false);
  const [expositionId, setExpositionId] = useState('');
  const [expositionName, setExpositionName] = useState('');
  const [naturalRange, setNaturalRange] = useState('');
  const [sampleOrigin, setSampleOrigin] = useState('');
  const [economicUse, setEconomicUse] = useState('');
  const [ecologyAndBiology, setEcologyAndBiology] = useState('');
  const [conservationStatus, setConservationStatus] = useState('');

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

  // Логируем, что смонтировались
  useEffect(() => {
    logWithTimestamp('[AddSpecimenScreen] Компонент смонтирован');
    return () => {
      logWithTimestamp('[AddSpecimenScreen] Компонент размонтирован');
    };
  }, []);

  return {
    // Параметры
    mode,
    sector,
    isSimpleMode,

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
    cultivar, setCultivar,
    form, setForm,
    synonyms, setSynonyms,

    plantingYear, setPlantingYear,
    hasHerbarium, setHasHerbarium,
    expositionId, setExpositionId,
    expositionName, setExpositionName,
    naturalRange, setNaturalRange,
    sampleOrigin, setSampleOrigin,
    economicUse, setEconomicUse,
    ecologyAndBiology, setEcologyAndBiology,
    conservationStatus, setConservationStatus,

    description, setDescription,
    category, setCategory,
    location, setLocation,
    careInstructions, setCareInstructions,

    images, setImages,
    loading, setLoading,
    errors, setErrors,
  };
}
