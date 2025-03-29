import { useState, useCallback } from 'react';
import { plantsApi } from '../services/plantsApi';
import { 
  Specimen, 
  SpecimenCreateDto, 
  SpecimenUpdateDto,
  SpecimenSearchParams,
  SpecimenCoordinatesDto,
  Family,
  Exposition
} from '@/types';

interface UsePlantsServiceResult {
  specimens: Specimen[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  
  // Загрузка списка растений
  loadSpecimens: (params?: SpecimenSearchParams) => Promise<void>;
  
  // Получение деталей растения
  getSpecimenDetails: (id: number) => Promise<Specimen | null>;
  
  // Операции CRUD для растений
  createSpecimen: (data: SpecimenCreateDto) => Promise<Specimen | null>;
  createSpecimenWithImages: (data: SpecimenCreateDto, imageUris: string[]) => Promise<{specimen: Specimen | null, imageIds: number[]}>;
  updateSpecimen: (id: number, data: SpecimenUpdateDto) => Promise<Specimen | null>;
  deleteSpecimen: (id: number) => Promise<boolean>;
  
  // Работа с координатами
  updateSpecimenCoordinates: (id: number, coordinates: SpecimenCoordinatesDto) => Promise<Specimen | null>;
  
  // Работа с изображениями
  uploadSpecimenImage: (specimenId: number, imageUri: string, description?: string, isMain?: boolean) => Promise<string | null>;
  deleteSpecimenImage: (specimenId: number, imageId: number) => Promise<boolean>;
  setMainImage: (specimenId: number, imageId: number) => Promise<boolean>;
  
  // Получение справочников
  loadFamilies: () => Promise<Family[]>;
  loadExpositions: () => Promise<Exposition[]>;
}

export const usePlantsService = (): UsePlantsServiceResult => {
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const loadSpecimens = useCallback(async (params: SpecimenSearchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await plantsApi.getSpecimens(params);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      if (response.data) {
        // Сервер возвращает массив объектов, а не пагинированный ответ
        const items = response.data;
        setSpecimens(items);
        setTotalCount(items.length);
        // Здесь нет информации о пагинации, так что устанавливаем стандартные значения
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке растений');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSpecimenDetails = useCallback(async (id: number): Promise<Specimen | null> => {
    try {
      setLoading(true);
      const response = await plantsApi.getSpecimenById(id);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке информации о растении');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSpecimen = useCallback(async (data: SpecimenCreateDto): Promise<Specimen | null> => {
    try {
      setLoading(true);
      const response = await plantsApi.createSpecimen(data);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при создании растения');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSpecimenWithImages = useCallback(async (
    data: SpecimenCreateDto, 
    imageUris: string[]
  ): Promise<{specimen: Specimen | null, imageIds: number[]}> => {
    try {
      setLoading(true);
      const response = await plantsApi.createSpecimenWithImages(data, imageUris);
      if (response.error) {
        setError(response.error);
        return { specimen: null, imageIds: [] };
      }
      return {
        specimen: response.data?.specimen || null,
        imageIds: response.data?.imageIds || []
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при создании растения с изображениями');
      return { specimen: null, imageIds: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSpecimen = useCallback(async (id: number, data: SpecimenUpdateDto): Promise<Specimen | null> => {
    try {
      setLoading(true);
      const response = await plantsApi.updateSpecimen(id, data);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении растения');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSpecimen = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await plantsApi.deleteSpecimen(id);
      if (response.error) {
        setError(response.error);
        return false;
      }
      return response.status === 204; // NoContent = успешное удаление
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении растения');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSpecimenCoordinates = useCallback(async (id: number, coordinates: SpecimenCoordinatesDto): Promise<Specimen | null> => {
    try {
      setLoading(true);
      const response = await plantsApi.updateSpecimenCoordinates(id, coordinates);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении координат растения');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadSpecimenImage = useCallback(async (
    specimenId: number, 
    imageUri: string, 
    description?: string, 
    isMain: boolean = false
  ): Promise<string | null> => {
    try {
      setLoading(true);
      const response = await plantsApi.uploadSpecimenImage(specimenId, imageUri, description, isMain);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data?.imageUrl || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке изображения');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSpecimenImage = useCallback(async (specimenId: number, imageId: number): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await plantsApi.deleteSpecimenImage(specimenId, imageId);
      if (response.error) {
        setError(response.error);
        return false;
      }
      return response.data?.success || false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении изображения');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const setMainImage = useCallback(async (specimenId: number, imageId: number): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await plantsApi.setMainImage(specimenId, imageId);
      if (response.error) {
        setError(response.error);
        return false;
      }
      return response.data?.success || false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при установке основного изображения');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFamilies = useCallback(async (): Promise<Family[]> => {
    try {
      setLoading(true);
      const response = await plantsApi.getFamilies();
      if (response.error) {
        setError(response.error);
        return [];
      }
      const data = response.data || [];
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке семейств растений');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadExpositions = useCallback(async (): Promise<Exposition[]> => {
    try {
      setLoading(true);
      const response = await plantsApi.getExpositions();
      if (response.error) {
        setError(response.error);
        return [];
      }
      const data = response.data || [];
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке экспозиций');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    specimens,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    loadSpecimens,
    getSpecimenDetails,
    createSpecimen,
    createSpecimenWithImages,
    updateSpecimen,
    deleteSpecimen,
    updateSpecimenCoordinates,
    uploadSpecimenImage,
    deleteSpecimenImage,
    setMainImage,
    loadFamilies,
    loadExpositions,
  };
}; 