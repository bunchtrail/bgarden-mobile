import { useState, useEffect, useCallback } from 'react';
import { Specimen } from '@/types';
import { plantsApi } from '@/modules/plants/services';

// Хук для работы с данными растения
export const usePlantDetails = (plantId: number) => {
  const [plant, setPlant] = useState<Specimen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlantDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPlant(null); // Сброс перед загрузкой

    if (isNaN(plantId) || plantId <= 0) {
      setError('Неверный ID растения.');
      setLoading(false);
      return;
    }

    try {
      const response = await plantsApi.getSpecimenById(plantId);

      if (response.error) {
        setError(`Не удалось загрузить данные о растении. ${response.error}`);
      } else if (response.data) {
        setPlant(response.data);
      } else {
        setError('Данные о растении не найдены.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная сетевая ошибка или ошибка обработки данных.';
      setError(`Произошла ошибка: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [plantId]); // Зависимость от plantId

  useEffect(() => {
    loadPlantDetails();
  }, [loadPlantDetails]); // Зависимость от loadPlantDetails

  return { plant, loading, error, loadPlantDetails };
}; 