import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Button } from '@/components/Button';
import { ImageUploader } from '@/components/plants';
import { Header } from '@/components/Header';

import { useSpecimenFormState } from './hooks/useSpecimenFormState';
import { useSpecimenFormValidation } from './hooks/useSpecimenFormValidation';
import { useSpecimenSubmit } from './hooks/useSpecimenSubmit';
import { styles } from './styles';
import { plantsApi } from '@/modules/plants/services';
import { LocationType } from '@/types';

import { SimpleSpecimenForm } from './SimpleSpecimenForm';
import { FullSpecimenForm } from './FullSpecimenForm';
import { logWithTimestamp } from './utils/logWithTimestamp';

export default function AddSpecimenScreen() {
  console.log('[AddSpecimenScreen] Рендеринг экрана добавления образца');
  logWithTimestamp('[AddSpecimenScreen] START RENDER');

  // Достаём все переменные стейта и функции из нашего хука
  const form = useSpecimenFormState();
  const {
    mode,
    isSimpleMode,
    inventoryNumber,
    setInventoryNumber,
    russianName,
    setRussianName,
    latinName,
    setLatinName,
    genus,
    setGenus,
    species,
    setSpecies,
    sectorType,
    setSectorType,
    locationType,
    setLocationType,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    mapId,
    setMapId,
    mapX,
    setMapX,
    mapY,
    setMapY,
    familyId,
    setFamilyId,
    familyName,
    setFamilyName,
    cultivar,
    setCultivar,
    form: formValue,
    setForm,
    synonyms,
    setSynonyms,
    plantingYear,
    setPlantingYear,
    hasHerbarium,
    setHasHerbarium,
    expositionId,
    setExpositionId,
    expositionName,
    setExpositionName,
    naturalRange,
    setNaturalRange,
    sampleOrigin,
    setSampleOrigin,
    economicUse,
    setEconomicUse,
    ecologyAndBiology,
    setEcologyAndBiology,
    conservationStatus,
    setConservationStatus,
    description,
    setDescription,
    category,
    setCategory,
    location,
    setLocation,
    careInstructions,
    setCareInstructions,
    images,
    setImages,
    loading,
    setLoading,
    errors,
    setErrors,
  } = form;

  console.log(`[AddSpecimenScreen] Параметры: mode=${mode}`);
  console.log(`[AddSpecimenScreen] Режим формы: ${isSimpleMode ? 'упрощенный' : 'полный'}`);

  // Хук для валидации
  const { validateForm } = useSpecimenFormValidation({
    isSimpleMode,
    inventoryNumber,
    russianName,
    latinName,
    familyId,
    description,
    category,
    setErrors,
  });

  // Используем хук для отправки формы
  const { handleSubmit } = useSpecimenSubmit({ form, validateForm });

  // Кнопка "Отмена"
  const handleCancel = () => {
    console.log('[AddSpecimenScreen] Нажата кнопка Отмена, возвращаемся назад');
    router.back();
  };

  // Вспомогательная функция для заголовка в "простом" режиме
  const getSectorName = (st: number): string => {
    switch (st) {
      case 0:
        return 'Дендрология';
      case 1:
        return 'Флора';
      case 2:
        return 'Цветоводство';
      default:
        return 'Не указан';
    }
  };

  return (
    <View style={styles.container}>
      {/* Шапка */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Header
          title={
            isSimpleMode
              ? `Добавление растения: ${getSectorName(sectorType)}`
              : 'Добавление образца растения'
          }
          titleColor="black"
          style={styles.header}
        />
      </View>

      {/* Контейнер со скроллом */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ветка для простой формы */}
        {isSimpleMode ? (
          <SimpleSpecimenForm
            form={{
              russianName,
              setRussianName,
              latinName,
              setLatinName,
              description,
              setDescription,
              category,
              setCategory,
              location,
              setLocation,
              careInstructions,
              setCareInstructions,
              errors,
            }}
          />
        ) : (
          <FullSpecimenForm
            form={{
              inventoryNumber,
              setInventoryNumber,
              russianName,
              setRussianName,
              latinName,
              setLatinName,
              sectorType,
              setSectorType,

              familyId,
              setFamilyId,
              genus,
              setGenus,
              species,
              setSpecies,
              cultivar,
              setCultivar,
              form: formValue,
              setForm,
              synonyms,
              setSynonyms,

              locationType,
              setLocationType,
              latitude,
              setLatitude,
              longitude,
              setLongitude,
              mapId,
              setMapId,
              mapX,
              setMapX,
              mapY, 
              setMapY,

              plantingYear,
              setPlantingYear,
              hasHerbarium,
              setHasHerbarium,
              naturalRange,
              setNaturalRange,
              sampleOrigin,
              setSampleOrigin,
              economicUse,
              setEconomicUse,
              ecologyAndBiology,
              setEcologyAndBiology,
              conservationStatus,
              setConservationStatus,

              errors,
            }}
          />
        )}

        {/* Загрузка изображений */}
        <ImageUploader
          value={images}
          onChange={setImages}
          onError={(error) => Alert.alert('Ошибка', error)}
          maxImages={5}
          loading={loading}
        />

        {/* Кнопки */}
        <View style={styles.buttonsContainer}>
          <Button
            title="Отмена"
            onPress={handleCancel}
            variant="secondary"
            style={styles.button}
            disabled={loading}
          />
          <Button
            title="Сохранить"
            onPress={handleSubmit}
            variant="primary"
            style={styles.button}
            disabled={loading}
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
}
