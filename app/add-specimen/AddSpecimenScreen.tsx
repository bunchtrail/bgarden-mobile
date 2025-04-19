import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';

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
  const router = useRouter();

  // Получаем состояние формы из хука
  const formState = useSpecimenFormState();
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
    expositions,
    expositionId,
    setExpositionId,
  } = formState;

  // Получаем валидатор формы
  const { validateForm } = useSpecimenFormValidation(formState);
  
  // Обработчик отправки формы
  const { submitSpecimen } = useSpecimenSubmit(
    {
      inventoryNumber: formState.inventoryNumber,
      russianName: formState.russianName,
      latinName: formState.latinName,
      familyId: formState.familyId,
      description: formState.description,
      locationType: formState.locationType,
      latitude: formState.latitude,
      longitude: formState.longitude,
      mapId: formState.mapId,
      mapX: formState.mapX,
      mapY: formState.mapY,
      sectorType: formState.sectorType,
      expositionId: formState.expositionId
    }, 
    setLoading
  );
  
  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      submitSpecimen();
    } else {
      Alert.alert('Ошибка валидации', 'Пожалуйста, проверьте правильность заполнения полей.');
    }
  }, [validateForm, submitSpecimen]);
  
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

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
    mapId,
    setMapId,
    mapX,
    setMapX,
    mapY,
    setMapY,
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
    expositions,
    expositionId,
    setExpositionId,
    errors,
    dropdownVisible,
    setDropdownVisible,
  }), [
    inventoryNumber, russianName, latinName, 
    locationType, latitude, longitude, 
    mapId, mapX, mapY,
    sectorType, familyId, familyName, 
    description, errors, getCurrentLocation, families,
    expositions, expositionId,
    dropdownVisible
  ]);

  // Если загрузка - показываем индикатор
  if (loading || !families.length || !expositions.length) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Добавление экземпляра</Text>
          </View>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={{ marginTop: 20, textAlign: 'center' }}>
            Загрузка данных...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      
      {/* Заголовок */}
      <SpecimenHeader onBack={handleBack} sectorType={sectorType} />
      
      {/* Основной контент */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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

        {/* Кнопки действий */}
        <FormButtons
          onSave={handleSubmit}
          onCancel={handleBack}
          loading={loading}
        />
      </ScrollView>
    </View>
  );
}
