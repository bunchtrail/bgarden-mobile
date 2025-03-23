import { useState, useCallback } from 'react';
import { SectorType, SpecimenFilterParams } from '@/types';
import { mockFamilies, mockRegions, mockExpositions } from '@/data/mockData';

interface ModalItem {
  id: number | SectorType;
  name: string;
  [key: string]: string | number | SectorType;
}

export function useModalData() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');

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
        items = mockFamilies as ModalItem[];
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
        items = mockRegions as ModalItem[];
        title = 'Выберите регион';
        break;
      case 'exposition':
        items = mockExpositions as ModalItem[];
        title = 'Выберите экспозицию';
        break;
      default:
        title = '';
    }

    return { items, title };
  }, [modalType]);

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
    getActiveItemId
  };
} 