import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { Colors } from '@/constants/Colors';
import FormField from './FormField';
import { Checkbox } from '@/components/ui/Checkbox';

interface BasicInfoSectionProps {
  inventoryNumber: string;
  setInventoryNumber: (value: string) => void;
  russianName: string;
  setRussianName: (value: string) => void;
  latinName: string;
  setLatinName: (value: string) => void;
  familyDropdownComponent: React.ReactNode;
  expositionDropdownComponent: React.ReactNode;
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
  determinedBy: string;
  setDeterminedBy: (value: string) => void;
  plantingYear: string;
  setPlantingYear: (value: string) => void;
  sampleOrigin: string;
  setSampleOrigin: (value: string) => void;
  naturalRange: string;
  setNaturalRange: (value: string) => void;
  ecologyAndBiology: string;
  setEcologyAndBiology: (value: string) => void;
  economicUse: string;
  setEconomicUse: (value: string) => void;
  conservationStatus: string;
  setConservationStatus: (value: string) => void;
  hasHerbarium: boolean;
  setHasHerbarium: (value: boolean) => void;
  duplicatesInfo: string;
  setDuplicatesInfo: (value: string) => void;
  originalBreeder: string;
  setOriginalBreeder: (value: string) => void;
  originalYear: string;
  setOriginalYear: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  errors: Record<string, string>;
}

export const BasicInfoSection = memo(function BasicInfoSectionComponent({
  inventoryNumber, setInventoryNumber,
  russianName, setRussianName,
  latinName, setLatinName,
  familyDropdownComponent,
  expositionDropdownComponent,
  genus, setGenus,
  species, setSpecies,
  cultivar, setCultivar,
  form, setForm,
  synonyms, setSynonyms,
  determinedBy, setDeterminedBy,
  plantingYear, setPlantingYear,
  sampleOrigin, setSampleOrigin,
  naturalRange, setNaturalRange,
  ecologyAndBiology, setEcologyAndBiology,
  economicUse, setEconomicUse,
  conservationStatus, setConservationStatus,
  hasHerbarium, setHasHerbarium,
  duplicatesInfo, setDuplicatesInfo,
  originalBreeder, setOriginalBreeder,
  originalYear, setOriginalYear,
  country, setCountry,
  errors
}: BasicInfoSectionProps) {

  const [showAdvanced, setShowAdvanced] = useState(false);
  
  return (
    <View style={[styles.sectionContainer, { zIndex: 10 }]}>
      <Text style={styles.sectionTitle}>Основная информация</Text>
      <FormField
        label="Инвентарный номер"
        value={inventoryNumber}
        onChangeText={setInventoryNumber}
        error={errors?.inventoryNumber}
        placeholder="Введите или отсканируйте номер"
        leftIcon={<Ionicons name="barcode-outline" size={20} color={Colors.light.primary} />}
      />
      
      {/* Семейство и Экспозиция */}
      <View style={{ zIndex: 2 }}>
        {familyDropdownComponent}
      </View>
      <View style={{ zIndex: 1 }}>
        {expositionDropdownComponent}
      </View>
      
      {/* Основные названия */}
      <FormField
        label="Русское название"
        value={russianName}
        onChangeText={setRussianName}
        error={errors?.russianName}
        placeholder="Введите русское название"
        leftIcon={<Ionicons name="text-outline" size={20} color={Colors.light.primary} />}
      />
      <FormField
        label="Латинское название"
        value={latinName}
        onChangeText={setLatinName}
        error={errors?.latinName}
        placeholder="Введите латинское название"
        leftIcon={<Ionicons name="language-outline" size={20} color={Colors.light.primary} />}
      />

      {/* Кнопка Дополнительно */}
      <TouchableOpacity 
        style={styles.advancedButton} 
        onPress={() => setShowAdvanced(!showAdvanced)}
      >
        <Text style={styles.advancedButtonText}>
          {showAdvanced ? 'Скрыть дополнительные поля' : 'Показать дополнительные поля'}
        </Text>
        <Ionicons 
          name={showAdvanced ? "chevron-up-outline" : "chevron-down-outline"} 
          size={20} 
          color={Colors.light.primary} 
        />
      </TouchableOpacity>

      {/* Дополнительные поля */} 
      {showAdvanced && (
        <View>
          <FormField
            label="Род (Genus)"
            value={genus}
            onChangeText={setGenus}
            error={errors?.genus}
            placeholder="Введите род"
            leftIcon={<Ionicons name="leaf-outline" size={20} color={Colors.light.primary} />}
          />
          <FormField
            label="Вид (Species)"
            value={species}
            onChangeText={setSpecies}
            error={errors?.species}
            placeholder="Введите вид"
            leftIcon={<Ionicons name="leaf-outline" size={20} color={Colors.light.primary} />}
          />
           <FormField
            label="Сорт (Cultivar)"
            value={cultivar}
            onChangeText={setCultivar}
            error={errors?.cultivar}
            placeholder="Введите сорт (если применимо)"
            leftIcon={<Ionicons name="pricetag-outline" size={20} color={Colors.light.primary} />}
          />
          <FormField
            label="Форма (Form)"
            value={form}
            onChangeText={setForm}
            error={errors?.form}
            placeholder="Введите форму (если применимо)"
            leftIcon={<Ionicons name="shapes-outline" size={20} color={Colors.light.primary} />}
          />
          <FormField
            label="Синонимы"
            value={synonyms}
            onChangeText={setSynonyms}
            error={errors?.synonyms}
            placeholder="Введите синонимы через запятую"
            leftIcon={<Ionicons name="list-outline" size={20} color={Colors.light.primary} />}
          />
          <FormField
            label="Определил"
            value={determinedBy}
            onChangeText={setDeterminedBy}
            error={errors?.determinedBy}
            placeholder="ФИО или источник определения"
            leftIcon={<Ionicons name="person-outline" size={20} color={Colors.light.primary} />}
          />
          <FormField
            label="Год посадки"
            value={plantingYear}
            onChangeText={setPlantingYear}
            error={errors?.plantingYear}
            placeholder="ГГГГ"
            keyboardType="numeric"
            maxLength={4}
            leftIcon={<Ionicons name="calendar-outline" size={20} color={Colors.light.primary} />}
          />
          <FormField
            label="Происхождение образца"
            value={sampleOrigin}
            onChangeText={setSampleOrigin}
            error={errors?.sampleOrigin}
            placeholder="Место сбора, питомник и т.д."
            leftIcon={<Ionicons name="earth-outline" size={20} color={Colors.light.primary} />}
          />
          <FormField
            label="Естественный ареал"
            value={naturalRange}
            onChangeText={setNaturalRange}
            error={errors?.naturalRange}
            placeholder="Географический регион(ы)"
            leftIcon={<Ionicons name="map-outline" size={20} color={Colors.light.primary} />}
          />
          <FormField
            label="Экология и биология"
            value={ecologyAndBiology}
            onChangeText={setEcologyAndBiology}
            error={errors?.ecologyAndBiology}
            placeholder="Особенности роста, требования и т.д."
            leftIcon={<Ionicons name="flask-outline" size={20} color={Colors.light.primary} />}
            multiline
          />
          <FormField
            label="Хозяйственное использование"
            value={economicUse}
            onChangeText={setEconomicUse}
            error={errors?.economicUse}
            placeholder="Декоративное, пищевое, лекарственное и т.д."
            leftIcon={<Ionicons name="construct-outline" size={20} color={Colors.light.primary} />}
            multiline
          />
          <FormField
            label="Охранный статус"
            value={conservationStatus}
            onChangeText={setConservationStatus}
            error={errors?.conservationStatus}
            placeholder="IUCN статус, Красная книга и т.д."
            leftIcon={<Ionicons name="shield-checkmark-outline" size={20} color={Colors.light.primary} />}
          />
          <Checkbox
            label="Наличие гербария"
            value={hasHerbarium}
            onValueChange={setHasHerbarium}
          />
          <FormField
            label="Информация о дубликатах"
            value={duplicatesInfo}
            onChangeText={setDuplicatesInfo}
            error={errors?.duplicatesInfo}
            placeholder="Где хранятся дубликаты"
            leftIcon={<Ionicons name="copy-outline" size={20} color={Colors.light.primary} />}
          />
          <FormField
            label="Оригинатор"
            value={originalBreeder}
            onChangeText={setOriginalBreeder}
            error={errors?.originalBreeder}
            placeholder="ФИО или название организации"
            leftIcon={<Ionicons name="person-circle-outline" size={20} color={Colors.light.primary} />}
          />
          <FormField
            label="Год оригинатора"
            value={originalYear}
            onChangeText={setOriginalYear}
            error={errors?.originalYear}
            placeholder="ГГГГ"
            keyboardType="numeric"
            maxLength={4}
            leftIcon={<Ionicons name="calendar-number-outline" size={20} color={Colors.light.primary} />}
          />
          <FormField
            label="Страна происхождения (для сортов)"
            value={country}
            onChangeText={setCountry}
            error={errors?.country}
            placeholder="Страна"
            leftIcon={<Ionicons name="flag-outline" size={20} color={Colors.light.primary} />}
          />
        </View>
      )}
    </View>
  );
}); 

export default BasicInfoSection;
