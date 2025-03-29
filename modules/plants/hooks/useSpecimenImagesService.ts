import { useState, useCallback } from 'react';
import { specimenImagesApi, CreateSpecimenImageDto, UpdateSpecimenImageDto } from '../services/specimenImagesApi';
import { SpecimenImage, BatchSpecimenImageResult } from '@/types';

interface UseSpecimenImagesServiceResult {
  images: SpecimenImage[];
  loading: boolean;
  error: string | null;
  
  // Загрузка изображений
  getSpecimenImages: (specimenId: number, includeImageData?: boolean) => Promise<SpecimenImage[]>;
  getMainImage: (specimenId: number) => Promise<SpecimenImage | null>;
  getImageById: (id: number) => Promise<SpecimenImage | null>;
  
  // Операции CRUD
  addImage: (data: CreateSpecimenImageDto) => Promise<SpecimenImage | null>;
  updateImage: (id: number, data: UpdateSpecimenImageDto) => Promise<SpecimenImage | null>;
  deleteImage: (id: number) => Promise<boolean>;
  
  // Специальные операции
  setAsMain: (id: number) => Promise<boolean>;
  batchUpload: (specimenId: number, imageUris: string[], isMain?: boolean) => Promise<BatchSpecimenImageResult | null>;
}

export const useSpecimenImagesService = (): UseSpecimenImagesServiceResult => {
  const [images, setImages] = useState<SpecimenImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getSpecimenImages = useCallback(async (specimenId: number, includeImageData: boolean = false): Promise<SpecimenImage[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await specimenImagesApi.getBySpecimenId(specimenId, includeImageData);
      
      if (response.error) {
        setError(response.error);
        return [];
      }
      
      if (response.data) {
        const images = response.data;
        setImages(images);
        return images;
      }
      
      return [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке изображений образца');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getMainImage = useCallback(async (specimenId: number): Promise<SpecimenImage | null> => {
    try {
      setLoading(true);
      const response = await specimenImagesApi.getMainImageBySpecimenId(specimenId);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке основного изображения');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getImageById = useCallback(async (id: number): Promise<SpecimenImage | null> => {
    try {
      setLoading(true);
      const response = await specimenImagesApi.getById(id);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке изображения');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addImage = useCallback(async (data: CreateSpecimenImageDto): Promise<SpecimenImage | null> => {
    try {
      setLoading(true);
      const response = await specimenImagesApi.add(data);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при добавлении изображения');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateImage = useCallback(async (id: number, data: UpdateSpecimenImageDto): Promise<SpecimenImage | null> => {
    try {
      setLoading(true);
      const response = await specimenImagesApi.update(id, data);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении изображения');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteImage = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await specimenImagesApi.delete(id);
      if (response.error) {
        setError(response.error);
        return false;
      }
      return response.status === 204; // NoContent = успешное удаление
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении изображения');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const setAsMain = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await specimenImagesApi.setAsMain(id);
      if (response.error) {
        setError(response.error);
        return false;
      }
      return response.status === 204; // NoContent = успешно
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при установке основного изображения');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const batchUpload = useCallback(async (
    specimenId: number, 
    imageUris: string[], 
    isMain: boolean = false
  ): Promise<BatchSpecimenImageResult | null> => {
    try {
      setLoading(true);
      const response = await specimenImagesApi.batchUpload(specimenId, imageUris, isMain);
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      // Обновляем список изображений после загрузки
      await getSpecimenImages(specimenId);
      
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при массовой загрузке изображений');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getSpecimenImages]);

  return {
    images,
    loading,
    error,
    getSpecimenImages,
    getMainImage,
    getImageById,
    addImage,
    updateImage,
    deleteImage,
    setAsMain,
    batchUpload
  };
}; 