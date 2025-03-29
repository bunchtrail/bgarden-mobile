import { useState, useCallback, useEffect } from 'react';
import { SectorType, SpecimenFilterParams, Specimen, Family, Region, Exposition } from '@/types';
import { plantsApi } from '@/modules/plants/services';

export function useFilterLogic(onFilterCallback: (data: Specimen[]) => void) {
  const [activeFilters, setActiveFilters] = useState<SpecimenFilterParams>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [families, setFamilies] = useState<Family[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [expositions, setExpositions] = useState<Exposition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Загружаем все справочники при первом рендере
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Загружаем основные данные
        const specimensResponse = await plantsApi.getSpecimens();
        if (specimensResponse.data) {
          onFilterCallback(specimensResponse.data);
        }

        // Загружаем справочники
        const familiesResponse = await plantsApi.getFamilies();
        if (familiesResponse.data) {
          setFamilies(familiesResponse.data);
        }

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

    loadData();
  }, [onFilterCallback]);

  const applyFilters = useCallback(async (filters: SpecimenFilterParams) => {
    setActiveFilters(filters);
    setLoading(true);

    try {
      // Формируем параметры запроса для API
      const searchParams = {
        familyId: filters.familyId,
        sectorType: filters.sectorType,
        regionId: filters.regionId,
        expositionId: filters.expositionId,
        query: filters.searchValue
      };
      
      // Получаем данные из API
      const response = await plantsApi.getSpecimens(searchParams);
      
      if (response.error) {

      } else if (response.data) {
        onFilterCallback(response.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [onFilterCallback]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    applyFilters({ ...activeFilters, searchValue: text });
  }, [activeFilters, applyFilters]);

  const clearFilters = useCallback(async () => {
    setSearchQuery('');
    setActiveFilters({});
    
    try {
      setLoading(true);
      const response = await plantsApi.getSpecimens();
      if (response.data) {
        onFilterCallback(response.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [onFilterCallback]);

  const selectFilter = useCallback((type: string, id: number | SectorType) => {
    let newFilters = { ...activeFilters };
    
    switch (type) {
      case 'family':
        newFilters.familyId = id as number;
        break;
      case 'sector':
        newFilters.sectorType = id as SectorType;
        break;
      case 'region':
        newFilters.regionId = id as number;
        break;
      case 'exposition':
        newFilters.expositionId = id as number;
        break;
    }
    
    applyFilters(newFilters);
  }, [activeFilters, applyFilters]);

  const getActiveFilterText = useCallback((type: string): string => {
    switch (type) {
      case 'family':
        if (activeFilters.familyId !== undefined) {
          const family = families.find(f => f.id === activeFilters.familyId);
          return family ? family.name : '';
        }
        return '';
      case 'sector':
        if (activeFilters.sectorType !== undefined) {
          switch (activeFilters.sectorType) {
            case SectorType.Dendrology: return 'Дендрология';
            case SectorType.Flora: return 'Флора';
            case SectorType.Flowering: return 'Цветение';
          }
        }
        return '';
      case 'region':
        if (activeFilters.regionId !== undefined) {
          const region = regions.find(r => r.id === activeFilters.regionId);
          return region ? region.name : '';
        }
        return '';
      case 'exposition':
        if (activeFilters.expositionId !== undefined) {
          const exposition = expositions.find(e => e.id === activeFilters.expositionId);
          return exposition ? exposition.name : '';
        }
        return '';
      default:
        return '';
    }
  }, [activeFilters, families, regions, expositions]);

  return {
    activeFilters,
    searchQuery,
    applyFilters,
    handleSearch,
    clearFilters,
    selectFilter,
    getActiveFilterText,
    loading
  };
} 