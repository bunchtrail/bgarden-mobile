import { useState, useEffect } from 'react';
import { Specimen, SpecimenFilterParams } from '@/types';
import { mockSpecimens } from '@/data/mockData';

export function useSpecimensData(initialFilters = {}) {
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterParams, setFilterParams] = useState<SpecimenFilterParams>(initialFilters);

  useEffect(() => {
    loadSpecimens();
  }, [filterParams]);

  const loadSpecimens = async () => {
    setLoading(true);
    
    try {
      setTimeout(() => {
        let filteredData = [...mockSpecimens];
        
        if (filterParams.familyId) {
          filteredData = filteredData.filter(s => s.familyId === filterParams.familyId);
        }
        
        if (filterParams.sectorType !== undefined) {
          filteredData = filteredData.filter(s => s.sectorType === filterParams.sectorType);
        }
        
        if (filterParams.regionId) {
          filteredData = filteredData.filter(s => s.regionId === filterParams.regionId);
        }
        
        if (filterParams.expositionId) {
          filteredData = filteredData.filter(s => s.expositionId === filterParams.expositionId);
        }
        
        if (filterParams.searchValue && filterParams.searchField) {
          const searchValue = filterParams.searchValue.toLowerCase();
          filteredData = filteredData.filter(s => {
            const field = filterParams.searchField as string;
            const fieldValue = s[field as keyof Specimen]?.toString().toLowerCase();
            return fieldValue?.includes(searchValue);
          });
        }
        
        console.log('ЗАГРУЖЕНО РАСТЕНИЙ:', filteredData.length);
        setSpecimens(filteredData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setLoading(false);
    }
  };

  return { specimens, loading, setFilterParams };
} 