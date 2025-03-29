import { useState, useEffect } from 'react';
import { Specimen, SpecimenFilterParams } from '@/types';
import { plantsApi } from '@/modules/plants/services';

export function useSpecimensData(initialFilters = {}) {
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterParams, setFilterParams] = useState<SpecimenFilterParams>(initialFilters);

  useEffect(() => {
    let isMounted = true;
    
    const loadSpecimens = async () => {
      setLoading(true);
      
      try {
        // Формируем параметры запроса для API
        const searchParams = {
          familyId: filterParams.familyId,
          sectorType: filterParams.sectorType,
          regionId: filterParams.regionId,
          expositionId: filterParams.expositionId,
          query: filterParams.searchValue
        };
        
        // Получаем данные из API
        const response = await plantsApi.getSpecimens(searchParams);
        
        if (!isMounted) return;
        
        if (response.error) {
          setSpecimens([]);
        } else if (response.data) {
          setSpecimens(response.data);
        } else {
          setSpecimens([]);
        }
      } catch (error) {
        if (isMounted) {
          setSpecimens([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSpecimens();
    
    // Функция очистки для предотвращения утечек памяти и обновления размонтированного компонента
    return () => {
      isMounted = false;
    };
  }, [filterParams]);

  return { specimens, loading, setFilterParams };
} 