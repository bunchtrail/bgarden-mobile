import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { Colors } from '@/constants/Colors';
import FormField from './FormField';
import { Family } from '@/types';

interface BasicInfoSectionProps {
  inventoryNumber: string;
  setInventoryNumber: (value: string) => void;
  russianName: string;
  setRussianName: (value: string) => void;
  latinName: string;
  setLatinName: (value: string) => void;
  familyId: string;
  setFamilyId: (value: string) => void;
  familyName: string;
  setFamilyName: (value: string) => void;
  families: Family[];
  dropdownVisible: boolean;
  setDropdownVisible: (visible: boolean) => void;
  dropdownPosition: { top: number; left: number; width: number };
  dropdownAnimation: Animated.Value;
  toggleFamilyDropdown: () => void;
  handleFamilySelect: (family: Family) => void;
  familyInputRef: React.RefObject<View>;
  errors: Record<string, string>;
}

export const BasicInfoSection = memo(function BasicInfoSectionComponent({
  inventoryNumber, setInventoryNumber,
  russianName, setRussianName,
  latinName, setLatinName,
  familyId, setFamilyId,
  familyName, setFamilyName,
  families,
  dropdownVisible, setDropdownVisible,
  dropdownAnimation,
  toggleFamilyDropdown,
  handleFamilySelect,
  familyInputRef,
  errors
}: BasicInfoSectionProps) {
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Основная информация</Text>
      <FormField
        label="Инвентарный номер"
        value={inventoryNumber}
        onChangeText={setInventoryNumber}
        error={errors?.inventoryNumber}
        placeholder="Введите или отсканируйте номер"
        leftIcon={<Ionicons name="barcode-outline" size={20} color={Colors.light.primary} />}
      />
      
      {/* Семейство */}
      <View style={[styles.fieldContainer, { position: 'relative', zIndex: 100 }]}>
        <Text style={styles.fieldLabel}>Семейство</Text>
        <View 
          ref={familyInputRef}
          collapsable={false} // Это важно для корректных измерений на Android
        >
          <TouchableOpacity
            style={[
              styles.inputContainer,
              styles.dropdownInput,
              errors?.familyId ? styles.errorInput : null
            ]}
            onPress={toggleFamilyDropdown}
            activeOpacity={0.8}
          >
            <View style={styles.leftIcon}>
              <Ionicons name="leaf-outline" size={20} color={Colors.light.primary} />
            </View>
            <Text style={[
              styles.textInput, 
              styles.inputWithIcon,
              !familyName && styles.placeholderText
            ]}>
              {familyName || 'Выберите семейство растения'}
            </Text>
            <Ionicons 
              name={dropdownVisible ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={Colors.light.primary} 
            />
          </TouchableOpacity>
        </View>
        {errors?.familyId && <Text style={styles.errorText}>{errors.familyId}</Text>}
        
        {/* Выпадающий список прямо внутри контейнера семейства */}
        {dropdownVisible && (
          <Animated.View 
            style={[
              styles.appleDropdown,
              {
                position: 'absolute',
                top: '100%', // Размещаем прямо под элементом
                left: 0,
                right: 0,
                zIndex: 1000,
                opacity: dropdownAnimation,
                transform: [{ 
                  scale: dropdownAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1]
                  }) 
                }]
              }
            ]}
          >
            {families && families.length > 0 ? (
              <ScrollView
                style={styles.dropdownList}
                contentContainerStyle={styles.dropdownListContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
                keyboardShouldPersistTaps="handled"
              >
                {families.map((item, index) => (
                  <React.Fragment key={item.id.toString()}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleFamilySelect(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.dropdownItemContent}>
                        <Text style={styles.dropdownItemText}>{item.name}</Text>
                        {item.description && (
                          <Text style={styles.dropdownItemDescription} numberOfLines={1}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                      {familyId === item.id.toString() && (
                        <Ionicons name="checkmark" size={18} color={Colors.light.primary} />
                      )}
                    </TouchableOpacity>
                    {index < families.length - 1 && <View style={styles.dropdownSeparator} />}
                  </React.Fragment>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noDataText}>Список семейств пуст</Text>
            )}
          </Animated.View>
        )}
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