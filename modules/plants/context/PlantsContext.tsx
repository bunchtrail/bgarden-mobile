import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Specimen, FilterParams, UserRole } from '@/types';
import { plantsApi } from '../services/plantsApi';

interface PlantsContextType {
  specimens: Specimen[];
  filteredSpecimens: Specimen[];
  loading: boolean;
  error: string | null;
  filterParams: FilterParams;
  setFilterParams: (params: Partial<FilterParams>) => void;
  userRole: UserRole;
  refreshData: () => Promise<void>;
}

const defaultFilterParams: FilterParams = {
  searchQuery: '',
  familyFilter: [],
  sectorFilter: [],
  statusFilter: []
};

const PlantsContext = createContext<PlantsContextType | undefined>(undefined);

export const usePlantsContext = () => {
  const context = useContext(PlantsContext);
  if (!context) {
    throw new Error('usePlantsContext must be used within a PlantsProvider');
  }
  return context;
};

export const PlantsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [filteredSpecimens, setFilteredSpecimens] = useState<Specimen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterParams, setFilterParams] = useState<FilterParams>(defaultFilterParams);
  const [userRole] = useState<UserRole>(UserRole.Client);
  const [isRequesting, setIsRequesting] = useState(false);

  const applyFilters = useCallback(() => {
    let result = [...specimens];

    if (filterParams.searchQuery) {
      const query = filterParams.searchQuery.toLowerCase();
      result = result.filter(
        item => 
          (item.russianName?.toLowerCase().includes(query) || false) ||
          (item.latinName?.toLowerCase().includes(query) || false) ||
          (item.genus?.toLowerCase().includes(query) || false) ||
          (item.species?.toLowerCase().includes(query) || false)
      );
    }

    if (filterParams.familyFilter && filterParams.familyFilter.length > 0) {
      result = result.filter(item => item.familyId && filterParams.familyFilter.includes(item.familyId.toString()));
    }

    if (filterParams.sectorFilter && filterParams.sectorFilter.length > 0) {
      result = result.filter(item => filterParams.sectorFilter.includes(item.sectorType.toString()));
    }

    if (filterParams.statusFilter && filterParams.statusFilter.length > 0) {
      result = result.filter(item => item.conservationStatus && filterParams.statusFilter.includes(item.conservationStatus));
    }

    setFilteredSpecimens(result);
  }, [specimens, filterParams]);

  const updateFilterParams = useCallback((newParams: Partial<FilterParams>) => {
    setFilterParams(prev => ({...prev, ...newParams}));
  }, []);

  const fetchData = useCallback(async () => {
    if (isRequesting) {
      return;
    }
    
    try {
      setIsRequesting(true);
      setLoading(true);
      setError(null);
      
      // Получаем данные из API
      const response = await plantsApi.getSpecimens();
      
      if (response.error) {
        setError(`Ошибка загрузки данных: ${response.error} (${response.status})`);
        setSpecimens([]);
        setFilteredSpecimens([]);
      } else if (response.data) {
        // Проверяем, отличаются ли новые данные от текущих
        const hasChanges = JSON.stringify(response.data) !== JSON.stringify(specimens);
        if (hasChanges) {
          setSpecimens(response.data);
          // Фильтрованные данные установятся через useEffect с зависимостью от applyFilters
        }
      } else {
        setError('Получен пустой ответ от сервера');
        setSpecimens([]);
        setFilteredSpecimens([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setError(`Ошибка: ${errorMessage}`);
      setSpecimens([]);
      setFilteredSpecimens([]);
    } finally {
      setLoading(false);
      setIsRequesting(false);
    }
  }, [isRequesting, specimens]);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchData();
    

  }, []);

  // Применяем фильтры при изменении данных или параметров фильтра
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Мемоизируем значение контекста
  const contextValue = useMemo(() => ({
    specimens,
    filteredSpecimens,
    loading,
    error,
    filterParams,
    setFilterParams: updateFilterParams,
    userRole,
    refreshData: fetchData
  }), [specimens, filteredSpecimens, loading, error, filterParams, updateFilterParams, userRole, fetchData]);

  return (
    <PlantsContext.Provider value={contextValue}>
      {children}
    </PlantsContext.Provider>
  );
}; 