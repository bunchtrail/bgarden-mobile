import { useState, useCallback } from 'react';
import { SectorType, SpecimenFilterParams, Specimen } from '@/types';
import { mockSpecimens, mockFamilies, mockRegions, mockExpositions } from '@/data/mockData';

export function useFilterLogic(onFilterCallback: (data: Specimen[]) => void) {
  const [activeFilters, setActiveFilters] = useState<SpecimenFilterParams>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  const applyFilters = useCallback((filters: SpecimenFilterParams) => {
    setActiveFilters(filters);

    let filteredData = [...mockSpecimens];

    if (filters.searchValue) {
      const query = filters.searchValue.toLowerCase();
      filteredData = filteredData.filter(
        (specimen) => 
          specimen.russianName.toLowerCase().includes(query) ||
          specimen.latinName.toLowerCase().includes(query) ||
          specimen.familyName.toLowerCase().includes(query)
      );
    }

    if (filters.familyId !== undefined) {
      filteredData = filteredData.filter(specimen => specimen.familyId === filters.familyId);
    }

    if (filters.sectorType !== undefined) {
      filteredData = filteredData.filter(specimen => specimen.sectorType === filters.sectorType);
    }

    if (filters.regionId !== undefined) {
      filteredData = filteredData.filter(specimen => specimen.regionId === filters.regionId);
    }

    if (filters.expositionId !== undefined) {
      filteredData = filteredData.filter(specimen => specimen.expositionId === filters.expositionId);
    }

    onFilterCallback(filteredData);
  }, [onFilterCallback]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    applyFilters({ ...activeFilters, searchValue: text });
  }, [activeFilters, applyFilters]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilters({});
    onFilterCallback(mockSpecimens);
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
          const family = mockFamilies.find(f => f.id === activeFilters.familyId);
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
          const region = mockRegions.find(r => r.id === activeFilters.regionId);
          return region ? region.name : '';
        }
        return '';
      case 'exposition':
        if (activeFilters.expositionId !== undefined) {
          const exposition = mockExpositions.find(e => e.id === activeFilters.expositionId);
          return exposition ? exposition.name : '';
        }
        return '';
      default:
        return '';
    }
  }, [activeFilters]);

  return {
    activeFilters,
    searchQuery,
    applyFilters,
    handleSearch,
    clearFilters,
    selectFilter,
    getActiveFilterText
  };
} 