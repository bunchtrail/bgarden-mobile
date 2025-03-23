import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Specimen, FilterParams, UserRole } from '@/types';
import { mockSpecimens } from '@/data/mockData';

interface PlantsContextType {
  specimens: Specimen[];
  filteredSpecimens: Specimen[];
  loading: boolean;
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
  const [filterParams, setFilterParams] = useState<FilterParams>(defaultFilterParams);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.Client);

  const applyFilters = () => {
    let result = [...specimens];

    if (filterParams.searchQuery) {
      const query = filterParams.searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.name.toLowerCase().includes(query) ||
          item.scientificName.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    if (filterParams.familyFilter && filterParams.familyFilter.length > 0) {
      result = result.filter(item => filterParams.familyFilter.includes(item.family));
    }

    if (filterParams.sectorFilter && filterParams.sectorFilter.length > 0) {
      result = result.filter(item => filterParams.sectorFilter.includes(item.sector));
    }

    if (filterParams.statusFilter && filterParams.statusFilter.length > 0) {
      result = result.filter(item => filterParams.statusFilter.includes(item.status));
    }

    setFilteredSpecimens(result);
  };

  const updateFilterParams = (newParams: Partial<FilterParams>) => {
    setFilterParams(prev => ({...prev, ...newParams}));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // В реальном приложении здесь был бы API запрос
      // const response = await api.getSpecimens();
      
      // Используем моковые данные
      await new Promise(resolve => setTimeout(resolve, 500)); // имитация задержки запроса
      setSpecimens(mockSpecimens);
      setFilteredSpecimens(mockSpecimens);
    } catch (error) {
      console.error('Ошибка при загрузке данных о растениях', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [specimens, filterParams]);

  return (
    <PlantsContext.Provider
      value={{
        specimens,
        filteredSpecimens,
        loading,
        filterParams,
        setFilterParams: updateFilterParams,
        userRole,
        refreshData: fetchData
      }}
    >
      {children}
    </PlantsContext.Provider>
  );
}; 