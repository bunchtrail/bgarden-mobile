import { useState, useCallback, useEffect } from 'react';
import { SectorType, SpecimenFilterParams, Family, Region, Exposition } from '@/types';
import { plantsApi } from '@/modules/plants/services';

interface ModalItem {
  id: number | SectorType;
  name: string;
  [key: string]: string | number | SectorType;
}

export function useModalData() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [families, setFamilies] = useState<Family[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [expositions, setExpositions] = useState<Exposition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Загружаем справочники при инициализации компонента
  useEffect(() => {
    const loadReferences = async () => {
      setLoading(true);
      try {
        // Загружаем семейства
        const familiesResponse = await plantsApi.getFamilies();
        if (familiesResponse.data) {
          setFamilies(familiesResponse.data);
        }

        // Загружаем экспозиции
        const expositionsResponse = await plantsApi.getExpositions();
        if (expositionsResponse.data) {
          setExpositions(expositionsResponse.data);
        }

        // Примечание: загрузка регионов должна быть реализована в API
        // Пока оставляем пустой массив
        setRegions([]);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadReferences();
  }, []);

  const openModal = useCallback((type: string) => {
    setModalType(type);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const getModalData = useCallback((): {
    items: ModalItem[],
    title: string
  } => {
    let items: ModalItem[] = [];
    let title = '';

    switch (modalType) {
      case 'family':
        items = families as ModalItem[];
        title = 'Выберите семейство';
        break;
      case 'sector':
        items = [
          { id: SectorType.Dendrology, name: 'Дендрология' },
          { id: SectorType.Flora, name: 'Флора' },
          { id: SectorType.Flowering, name: 'Цветение' }
        ];
        title = 'Выберите сектор';
        break;
      case 'region':
        items = regions as ModalItem[];
        title = 'Выберите регион';
        break;
      case 'exposition':
        items = expositions as ModalItem[];
        title = 'Выберите экспозицию';
        break;
      default:
        title = '';
    }

    return { items, title };
  }, [modalType, families, regions, expositions]);

  const getActiveItemId = useCallback((activeFilters: SpecimenFilterParams): number | SectorType | undefined => {
    switch (modalType) {
      case 'family': return activeFilters.familyId;
      case 'sector': return activeFilters.sectorType;
      case 'region': return activeFilters.regionId;
      case 'exposition': return activeFilters.expositionId;
      default: return undefined;
    }
  }, [modalType]);

  return {
    modalVisible,
    modalType,
    openModal,
    closeModal,
    getModalData,
    getActiveItemId,
    loading
  };
} 