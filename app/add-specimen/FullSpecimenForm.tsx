import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { SectorTypeSelector } from './SectorTypeSelector';
import { LocationTypeSelector } from './LocationTypeSelector';
import { styles } from './styles';
import { SectorType, LocationType } from '@/types';

interface FormData {
  // Базовая
  inventoryNumber: string;
  setInventoryNumber: (value: string) => void;
  russianName: string;
  setRussianName: (value: string) => void;
  latinName: string;
  setLatinName: (value: string) => void;
  sectorType: SectorType;
  setSectorType: (value: SectorType) => void;

  // Таксономия
  familyId: string;
  setFamilyId: (value: string) => void;
  genus: string;
  setGenus: (value: string) => void;
  species: string;
  setSpecies: (value: string) => void;
  cultivar: string;
  setCultivar: (value: string) => void;
  form: string;
  setForm: (value: string) => void;
  synonyms: string;
  setSynonyms: (value: string) => void;

  // Местоположение
  locationType: LocationType;
  setLocationType: (value: LocationType) => void;
  latitude: string;
  setLatitude: (value: string) => void;
  longitude: string;
  setLongitude: (value: string) => void;
  mapId: string;
  setMapId: (value: string) => void;
  mapX: string;
  setMapX: (value: string) => void;
  mapY: string;
  setMapY: (value: string) => void;

  // Доп. информация
  plantingYear: string;
  setPlantingYear: (value: string) => void;
  hasHerbarium: boolean;
  setHasHerbarium: (value: boolean) => void;
  naturalRange: string;
  setNaturalRange: (value: string) => void;
  sampleOrigin: string;
  setSampleOrigin: (value: string) => void;
  economicUse: string;
  setEconomicUse: (value: string) => void;
  ecologyAndBiology: string;
  setEcologyAndBiology: (value: string) => void;
  conservationStatus: string;
  setConservationStatus: (value: string) => void;

  errors: Record<string, string>;
}

interface FullSpecimenFormProps {
  form: FormData;
}

export function FullSpecimenForm({ form }: FullSpecimenFormProps) {
  const {
    inventoryNumber, setInventoryNumber,
    russianName, setRussianName,
    latinName, setLatinName,
    sectorType, setSectorType,

    familyId, setFamilyId,
    genus, setGenus,
    species, setSpecies,
    cultivar, setCultivar,
    form: formValue, setForm,
    synonyms, setSynonyms,

    locationType, setLocationType,
    latitude, setLatitude,
    longitude, setLongitude,
    mapId, setMapId,
    mapX, setMapX,
    mapY, setMapY,

    plantingYear, setPlantingYear,
    hasHerbarium, setHasHerbarium,
    naturalRange, setNaturalRange,
    sampleOrigin, setSampleOrigin,
    economicUse, setEconomicUse,
    ecologyAndBiology, setEcologyAndBiology,
    conservationStatus, setConservationStatus,

    errors,
  } = form;

  return (
    <View>
      {/* Базовая информация */}
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

        <SectorTypeSelector
          sectorType={sectorType}
          setSectorType={setSectorType}
        />
      </View>

      {/* Таксономия */}
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
          value={formValue}
          onChangeText={setForm}
          placeholder="Введите форму (опционально)"
          leftIcon={<Ionicons name="git-branch" size={20} color="#673AB7" />}
        />

        <Input
          label="Синонимы"
          value={synonyms}
          onChangeText={setSynonyms}
          placeholder="Введите синонимы (опционально)"
          multiline
          leftIcon={<Ionicons name="text" size={20} color="#673AB7" />}
        />
      </View>

      {/* Местоположение */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Местоположение</Text>

        <LocationTypeSelector
          locationType={locationType}
          setLocationType={setLocationType}
        />

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

      {/* Дополнительная информация */}
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
    </View>
  );
}
