import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/Button';
import { ImageUploader } from '@/components/plants';
import { Ionicons } from '@expo/vector-icons';
import { SectorType, LocationType } from '@/types';
import { plantsApi } from '@/modules/plants/services';
import { Header } from '@/components/Header';
import { Checkbox } from '@/components/ui/Checkbox';
import { Colors } from '@/constants/Colors';

// Функция для логирования с отметкой времени
const logWithTimestamp = (message: string) => {
  const now = new Date();
  const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
  console.log(`[${timestamp}] ${message}`);
};

export default function AddSpecimenScreen() {
  console.log('[AddSpecimenScreen] Рендеринг экрана добавления образца');
  logWithTimestamp('[AddSpecimenScreen] START RENDER');
  
  const { mode = 'full', sector = '' } = useLocalSearchParams<{ mode?: 'simple' | 'full', sector?: string }>();
  const isSimpleMode = mode === 'simple';
  
  console.log(`[AddSpecimenScreen] Параметры: mode=${mode}, sector=${sector}`);
  console.log(`[AddSpecimenScreen] Режим формы: ${isSimpleMode ? 'упрощенный' : 'полный'}`);

  // Базовая информация
  const [inventoryNumber, setInventoryNumber] = useState(isSimpleMode ? `INV-${Date.now()}` : '');
  const [russianName, setRussianName] = useState('');
  const [latinName, setLatinName] = useState('');
  const [genus, setGenus] = useState('');
  const [species, setSpecies] = useState('');
  const [sectorType, setSectorType] = useState<SectorType>(SectorType.Dendrology);
  
  // Местоположение
  const [locationType, setLocationType] = useState<LocationType>(LocationType.None);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [mapId, setMapId] = useState('');
  const [mapX, setMapX] = useState('');
  const [mapY, setMapY] = useState('');
  const [regionId, setRegionId] = useState('');
  const [regionName, setRegionName] = useState('');
  
  // Таксономия
  const [familyId, setFamilyId] = useState('1'); // По умолчанию 1, в реальности должен выбираться из списка
  const [familyName, setFamilyName] = useState('');
  const [cultivar, setCultivar] = useState('');
  const [form, setForm] = useState('');
  const [synonyms, setSynonyms] = useState('');
  
  // Дополнительная информация
  const [plantingYear, setPlantingYear] = useState('');
  const [hasHerbarium, setHasHerbarium] = useState(false);
  const [expositionId, setExpositionId] = useState('');
  const [expositionName, setExpositionName] = useState('');
  const [naturalRange, setNaturalRange] = useState('');
  const [sampleOrigin, setSampleOrigin] = useState('');
  const [economicUse, setEconomicUse] = useState('');
  const [ecologyAndBiology, setEcologyAndBiology] = useState('');
  const [conservationStatus, setConservationStatus] = useState('');
  
  // Для простого режима
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Установка сектора на основе параметра URL
  useEffect(() => {
    console.log(`[AddSpecimenScreen] useEffect для параметра sector=${sector}`);
    
    if (sector) {
      console.log(`[AddSpecimenScreen] Установка сектора: ${sector}`);
      switch (sector) {
        case 'dendrology':
          setSectorType(SectorType.Dendrology);
          break;
        case 'flora':
          setSectorType(SectorType.Flora);
          break;
        case 'flowers':
          setSectorType(SectorType.Flowering);
          break;
        default:
          setSectorType(SectorType.Flora);
      }
    }
  }, [sector]);

  // Монтирование/размонтирование компонента
  useEffect(() => {
    console.log('[AddSpecimenScreen] Компонент смонтирован');
    
    return () => {
      console.log('[AddSpecimenScreen] Компонент размонтирован');
    };
  }, []);

  const validateForm = useCallback(() => {
    console.log('[AddSpecimenScreen] Валидация формы');
    const newErrors: Record<string, string> = {};
    
    if (isSimpleMode) {
      if (!russianName.trim()) newErrors.russianName = 'Название растения обязательно';
      if (!latinName.trim()) newErrors.latinName = 'Научное название обязательно';
      if (!description.trim()) newErrors.description = 'Описание обязательно';
      if (!category.trim()) newErrors.category = 'Категория обязательна';
    } else {
      if (!inventoryNumber.trim()) newErrors.inventoryNumber = 'Инвентарный номер обязателен';
      if (!russianName.trim() && !latinName.trim()) newErrors.names = 'Необходимо указать хотя бы одно название (русское или латинское)';
      if (!familyId) newErrors.familyId = 'Семейство обязательно';
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log(`[AddSpecimenScreen] Форма ${isValid ? 'валидна' : 'не прошла валидацию'}`);
    return isValid;
  }, [isSimpleMode, inventoryNumber, russianName, latinName, familyId, description, category]);

  const handleSubmit = useCallback(async () => {
    console.log('[AddSpecimenScreen] Запуск обработчика отправки формы');
    
    if (!validateForm()) {
      console.log('[AddSpecimenScreen] Форма не прошла валидацию, отправка отменена');
      return;
    }
    
    setLoading(true);
    console.log('[AddSpecimenScreen] Начало процесса сохранения образца');
    
    try {
      const specimenData = {
        inventoryNumber,
        sectorType,
        russianName: russianName || undefined,
        latinName: latinName || undefined,
        familyId: parseInt(familyId, 10),
        genus: genus || undefined,
        species: species || undefined,
        cultivar: cultivar || undefined,
        form: form || undefined,
        synonyms: synonyms || undefined,
        plantingYear: plantingYear ? parseInt(plantingYear, 10) : undefined,
        hasHerbarium,
        expositionId: expositionId ? parseInt(expositionId, 10) : undefined,
        naturalRange: naturalRange || undefined,
        sampleOrigin: sampleOrigin || undefined,
        economicUse: economicUse || undefined,
        ecologyAndBiology: ecologyAndBiology || undefined,
        conservationStatus: conservationStatus || undefined,
        locationType
      };
      
      console.log('[AddSpecimenScreen] Подготовлены данные образца:', JSON.stringify(specimenData, null, 2));
      
      // Если указаны координаты, добавляем их в зависимости от типа
      if (locationType === LocationType.Geographic && latitude && longitude) {
        console.log('[AddSpecimenScreen] Добавление географических координат');
        Object.assign(specimenData, {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        });
      } else if (locationType === LocationType.SchematicMap && mapId && mapX && mapY) {
        console.log('[AddSpecimenScreen] Добавление схематических координат');
        Object.assign(specimenData, {
          mapId: parseInt(mapId, 10),
          mapX: parseFloat(mapX),
          mapY: parseFloat(mapY)
        });
      }
      
      // Если есть изображения, используем метод с загрузкой изображений
      if (images.length > 0) {
        console.log(`[AddSpecimenScreen] Отправка образца с ${images.length} изображениями`);
        await plantsApi.createSpecimenWithImages(specimenData, images);
      } else {
        // Создание образца без изображений
        console.log('[AddSpecimenScreen] Отправка образца без изображений');
        await plantsApi.createSpecimen(specimenData);
      }
      
      console.log('[AddSpecimenScreen] Образец успешно сохранен');
      Alert.alert(
        'Успешно',
        'Образец растения успешно добавлен в базу данных',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('[AddSpecimenScreen] Ошибка при добавлении образца:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при добавлении образца растения');
    } finally {
      console.log('[AddSpecimenScreen] Завершение процесса сохранения');
      setLoading(false);
    }
  }, [
    validateForm, inventoryNumber, russianName, latinName, 
    genus, species, sectorType, familyId, cultivar, form, synonyms,
    plantingYear, hasHerbarium, expositionId, naturalRange, sampleOrigin,
    economicUse, ecologyAndBiology, conservationStatus,
    locationType, latitude, longitude, mapId, mapX, mapY, images
  ]);

  const handleCancel = () => {
    console.log('[AddSpecimenScreen] Нажата кнопка Отмена, возвращаемся назад');
    router.back();
  };

  // Функция для отображения выбора сектора
  const renderSectorTypeSelector = () => {
    const sectors = [
      { value: SectorType.Dendrology, label: 'Дендрология' },
      { value: SectorType.Flora, label: 'Флора' },
      { value: SectorType.Flowering, label: 'Цветоводство' }
    ];
    
    return (
      <View style={styles.selectorContainer}>
        <Text style={styles.label}>Тип сектора:</Text>
        <View style={styles.sectorButtonsContainer}>
          {sectors.map(sector => (
            <TouchableOpacity
              key={sector.value}
              style={[
                styles.sectorButton,
                sectorType === sector.value && styles.sectorButtonSelected
              ]}
              onPress={() => setSectorType(sector.value)}
            >
              <Text style={[
                styles.sectorButtonText,
                sectorType === sector.value && styles.sectorButtonTextSelected
              ]}>
                {sector.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Функция для отображения выбора типа местоположения
  const renderLocationTypeSelector = () => {
    const locations = [
      { value: LocationType.None, label: 'Не указано' },
      { value: LocationType.Geographic, label: 'Географические' },
      { value: LocationType.SchematicMap, label: 'Схематические' }
    ];
    
    return (
      <View style={styles.selectorContainer}>
        <Text style={styles.label}>Тип координат:</Text>
        <View style={styles.sectorButtonsContainer}>
          {locations.map(loc => (
            <TouchableOpacity
              key={loc.value}
              style={[
                styles.sectorButton,
                locationType === loc.value && styles.sectorButtonSelected
              ]}
              onPress={() => setLocationType(loc.value)}
            >
              <Text style={[
                styles.sectorButtonText,
                locationType === loc.value && styles.sectorButtonTextSelected
              ]}>
                {loc.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const getSectorName = (sectorType: SectorType): string => {
    switch (sectorType) {
      case SectorType.Dendrology:
        return 'Дендрология';
      case SectorType.Flora:
        return 'Флора';
      case SectorType.Flowering:
        return 'Цветоводство';
      default:
        return 'Не указан';
    }
  };

  // Дополнительный эффект для отслеживания параметров URL
  useEffect(() => {
    logWithTimestamp(`[AddSpecimenScreen] URL Params: mode=${mode}, sector=${sector}`);
    
    // Проверяем, что страница отображается корректно
    setTimeout(() => {
      logWithTimestamp('[AddSpecimenScreen] Компонент должен быть отрендерен');
    }, 500);
    
    return () => {
      logWithTimestamp('[AddSpecimenScreen] Параметры URL изменились или компонент размонтирован');
    };
  }, [mode, sector]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={handleCancel}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Header 
          title={isSimpleMode 
            ? `Добавление растения: ${getSectorName(sectorType)}` 
            : "Добавление образца растения"} 
          titleColor="black"
          style={styles.header}
        />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isSimpleMode ? (
          // Упрощенная форма
          <>
            <Input
              label="Название растения"
              value={russianName}
              onChangeText={setRussianName}
              placeholder="Введите название растения"
              error={errors.russianName}
              leftIcon={<Ionicons name="leaf" size={20} color="#4CAF50" />}
            />
            
            <Input
              label="Научное название"
              value={latinName}
              onChangeText={setLatinName}
              placeholder="Введите научное название"
              error={errors.latinName}
              leftIcon={<Ionicons name="school" size={20} color="#009688" />}
            />
            
            <Input
              label="Описание"
              value={description}
              onChangeText={setDescription}
              placeholder="Введите описание растения"
              error={errors.description}
              multiline
              leftIcon={<Ionicons name="document-text" size={20} color="#607D8B" />}
            />
            
            <Input
              label="Категория"
              value={category}
              onChangeText={setCategory}
              placeholder="Введите категорию"
              error={errors.category}
              leftIcon={<Ionicons name="pricetag" size={20} color="#FF9800" />}
            />
            
            <Input
              label="Местоположение"
              value={location}
              onChangeText={setLocation}
              placeholder="Введите местоположение (опционально)"
              leftIcon={<Ionicons name="location" size={20} color="#F44336" />}
            />
            
            <Input
              label="Инструкции по уходу"
              value={careInstructions}
              onChangeText={setCareInstructions}
              placeholder="Введите инструкции по уходу (опционально)"
              multiline
              leftIcon={<Ionicons name="water" size={20} color="#2196F3" />}
            />
          </>
        ) : (
          // Полная форма
          <>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Базовая информация</Text>
              
              <Input
                label="Инвентарный номер"
                value={inventoryNumber}
                onChangeText={setInventoryNumber}
                placeholder="Введите инвентарный номер"
                error={errors.inventoryNumber}
                leftIcon={<Ionicons name="barcode" size={20} color="#4CAF50" />}
              />
              
              <Input
                label="Название на русском"
                value={russianName}
                onChangeText={setRussianName}
                placeholder="Введите русское название"
                error={errors.russianName}
                leftIcon={<Ionicons name="leaf" size={20} color="#4CAF50" />}
              />
              
              <Input
                label="Название на латыни"
                value={latinName}
                onChangeText={setLatinName}
                placeholder="Введите латинское название"
                error={errors.latinName}
                leftIcon={<Ionicons name="leaf-outline" size={20} color="#4CAF50" />}
              />
              
              {renderSectorTypeSelector()}
            </View>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Таксономия</Text>
              
              <Input
                label="Семейство ID"
                value={familyId}
                onChangeText={setFamilyId}
                placeholder="Введите ID семейства"
                error={errors.familyId}
                keyboardType="numeric"
                leftIcon={<Ionicons name="git-branch" size={20} color="#673AB7" />}
              />
              
              <Input
                label="Род"
                value={genus}
                onChangeText={setGenus}
                placeholder="Введите род"
                leftIcon={<Ionicons name="git-branch" size={20} color="#673AB7" />}
              />
              
              <Input
                label="Вид"
                value={species}
                onChangeText={setSpecies}
                placeholder="Введите вид"
                leftIcon={<Ionicons name="git-branch" size={20} color="#673AB7" />}
              />
              
              <Input
                label="Культивар"
                value={cultivar}
                onChangeText={setCultivar}
                placeholder="Введите культивар (опционально)"
                leftIcon={<Ionicons name="git-branch" size={20} color="#673AB7" />}
              />
              
              <Input
                label="Форма"
                value={form}
                onChangeText={setForm}
                placeholder="Введите форму (опционально)"
                leftIcon={<Ionicons name="git-branch" size={20} color="#673AB7" />}
              />
              
              <Input
                label="Синонимы"
                value={synonyms}
                onChangeText={setSynonyms}
                placeholder="Введите синонимы через запятую (опционально)"
                multiline
                leftIcon={<Ionicons name="text" size={20} color="#673AB7" />}
              />
            </View>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Местоположение</Text>
              
              {renderLocationTypeSelector()}
              
              {locationType === LocationType.Geographic && (
                <>
                  <Input
                    label="Широта"
                    value={latitude}
                    onChangeText={setLatitude}
                    placeholder="Введите широту"
                    keyboardType="numeric"
                    leftIcon={<Ionicons name="location" size={20} color="#F44336" />}
                  />
                  
                  <Input
                    label="Долгота"
                    value={longitude}
                    onChangeText={setLongitude}
                    placeholder="Введите долготу"
                    keyboardType="numeric"
                    leftIcon={<Ionicons name="location" size={20} color="#F44336" />}
                  />
                </>
              )}
              
              {locationType === LocationType.SchematicMap && (
                <>
                  <Input
                    label="ID карты"
                    value={mapId}
                    onChangeText={setMapId}
                    placeholder="Введите ID карты"
                    keyboardType="numeric"
                    leftIcon={<Ionicons name="map" size={20} color="#F44336" />}
                  />
                  
                  <Input
                    label="Координата X"
                    value={mapX}
                    onChangeText={setMapX}
                    placeholder="Введите координату X"
                    keyboardType="numeric"
                    leftIcon={<Ionicons name="map" size={20} color="#F44336" />}
                  />
                  
                  <Input
                    label="Координата Y"
                    value={mapY}
                    onChangeText={setMapY}
                    placeholder="Введите координату Y"
                    keyboardType="numeric"
                    leftIcon={<Ionicons name="map" size={20} color="#F44336" />}
                  />
                </>
              )}
            </View>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Дополнительная информация</Text>
              
              <Input
                label="Год посадки"
                value={plantingYear}
                onChangeText={setPlantingYear}
                placeholder="Введите год посадки (опционально)"
                keyboardType="numeric"
                leftIcon={<Ionicons name="calendar" size={20} color="#9E9E9E" />}
              />
              
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={hasHerbarium}
                  onValueChange={setHasHerbarium}
                  label="Имеется гербарий"
                />
              </View>
              
              <Input
                label="Естественный ареал"
                value={naturalRange}
                onChangeText={setNaturalRange}
                placeholder="Введите естественный ареал (опционально)"
                multiline
                leftIcon={<Ionicons name="globe" size={20} color="#2196F3" />}
              />
              
              <Input
                label="Происхождение образца"
                value={sampleOrigin}
                onChangeText={setSampleOrigin}
                placeholder="Введите происхождение образца (опционально)"
                leftIcon={<Ionicons name="trail-sign" size={20} color="#795548" />}
              />
              
              <Input
                label="Хозяйственное значение"
                value={economicUse}
                onChangeText={setEconomicUse}
                placeholder="Введите хозяйственное значение (опционально)"
                multiline
                leftIcon={<Ionicons name="business" size={20} color="#FF5722" />}
              />
              
              <Input
                label="Экология и биология"
                value={ecologyAndBiology}
                onChangeText={setEcologyAndBiology}
                placeholder="Введите информацию об экологии и биологии (опционально)"
                multiline
                leftIcon={<Ionicons name="leaf" size={20} color="#4CAF50" />}
              />
              
              <Input
                label="Охранный статус"
                value={conservationStatus}
                onChangeText={setConservationStatus}
                placeholder="Введите охранный статус (опционально)"
                leftIcon={<Ionicons name="shield" size={20} color="#F44336" />}
              />
            </View>
          </>
        )}
        
        <ImageUploader
          value={images}
          onChange={setImages}
          onError={(error) => Alert.alert('Ошибка', error)}
          maxImages={5}
          loading={loading}
        />
        
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    position: 'relative',
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    marginBottom: 0,
  },
  backButton: {
    padding: 10,
    marginRight: 5,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  checkboxContainer: {
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  selectorContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  sectorButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectorButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  sectorButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  sectorButtonText: {
    color: '#333',
    fontSize: 14,
  },
  sectorButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});