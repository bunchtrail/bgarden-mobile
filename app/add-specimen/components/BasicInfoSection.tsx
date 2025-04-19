import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { Colors } from '@/constants/Colors';
import FormField from './FormField';

interface BasicInfoSectionProps {
  inventoryNumber: string;
  setInventoryNumber: (value: string) => void;
  russianName: string;
  setRussianName: (value: string) => void;
  latinName: string;
  setLatinName: (value: string) => void;
  familyDropdownComponent: React.ReactNode;
  expositionDropdownComponent: React.ReactNode;
  errors: Record<string, string>;
}

export const BasicInfoSection = memo(function BasicInfoSectionComponent({
  inventoryNumber, setInventoryNumber,
  russianName, setRussianName,
  latinName, setLatinName,
  familyDropdownComponent,
  expositionDropdownComponent,
  errors
}: BasicInfoSectionProps) {
  
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
      
      {/* Семейство - теперь просто рендерим переданный компонент */} 
      <View style={{ zIndex: 2 }}>
        {familyDropdownComponent}
      </View>
      
      {/* Добавляем рендер Dropdown для экспозиции */} 
      <View style={{ zIndex: 1 }}>
        {expositionDropdownComponent}
      </View>
      
      {/* Названия растения */}
      <FormField
        label="Русское название"
        value={russianName}
        onChangeText={setRussianName}
        error={errors?.russianName}
        placeholder="Введите русское название растения"
        leftIcon={<Ionicons name="text-outline" size={20} color={Colors.light.primary} />}
      />
      
      <FormField
        label="Латинское название"
        value={latinName}
        onChangeText={setLatinName}
        error={errors?.latinName}
        placeholder="Введите латинское название растения"
        leftIcon={<Ionicons name="language-outline" size={20} color={Colors.light.primary} />}
      />
    </View>
  );
}); 