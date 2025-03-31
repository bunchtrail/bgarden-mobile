import React, { useCallback, useMemo, useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Alert, StatusBar } from 'react-native';
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
import { Colors } from '@/constants/Colors';

import { SimpleSpecimenForm } from './SimpleSpecimenForm';
import { logWithTimestamp } from './utils/logWithTimestamp';
import { getSectorName } from './utils/sectorUtils';
import { SpecimenHeader } from './components/SpecimenHeader';
import { FormButtons } from './components/FormButtons';

export default function AddSpecimenScreen() {
  console.log('[AddSpecimenScreen] Рендеринг экрана добавления образца');
  logWithTimestamp('[AddSpecimenScreen] START RENDER');

  // Достаём все переменные стейта и функции из нашего хука
  const form = useSpecimenFormState();
  const {
    mode,
    isSimpleMode = true,
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
    getCurrentLocation,
    families,
  } = form;

  console.log(`[AddSpecimenScreen] Параметры: mode=${mode}`);
  console.log(`[AddSpecimenScreen] Режим формы: упрощенный`);

  // Хук для валидации
  const { validateForm } = useSpecimenFormValidation({
    isSimpleMode: true,
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
  const handleCancel = useCallback(() => {
    console.log('[AddSpecimenScreen] Нажата кнопка Отмена, возвращаемся назад');
    router.back();
  }, []);

  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Мемоизируем объект формы для SimpleSpecimenForm
  const formProps = useMemo(() => ({
    inventoryNumber,
    setInventoryNumber,
    russianName,
    setRussianName,
    latinName,
    setLatinName,
    locationType,
    setLocationType,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    sectorType,
    setSectorType,
    familyId,
    setFamilyId,
    familyName,
    setFamilyName,
    description,
    setDescription,
    getCurrentLocation,
    families,
    errors,
    dropdownVisible,
    setDropdownVisible,
  }), [
    inventoryNumber, russianName, latinName, 
    locationType, latitude, longitude, 
    sectorType, familyId, familyName, 
    description, errors, getCurrentLocation, families,
    dropdownVisible
  ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      
      {/* Шапка */}
      <SpecimenHeader 
        sectorType={sectorType}
        onCancel={handleCancel}
      />

      {/* Контейнер со скроллом */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Используем только простую форму */}
        <SimpleSpecimenForm form={formProps} />

        {/* Загрузка изображений */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Фотографии</Text>
          <ImageUploader
            value={images}
            onChange={setImages}
            onError={(error) => Alert.alert('Ошибка', error)}
            maxImages={5}
            loading={loading}
          />
        </View>

        {/* Кнопки */}
        <FormButtons 
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </ScrollView>
    </View>
  );
}
