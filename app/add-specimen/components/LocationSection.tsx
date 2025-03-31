import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { Colors } from '@/constants/Colors';

interface LocationSectionProps {
  latitude: string;
  longitude: string;
  getCurrentLocation: () => Promise<void>;
  errors: Record<string, string>;
}

export const LocationSection = memo(function LocationSectionComponent({
  latitude,
  longitude,
  getCurrentLocation,
  errors
}: LocationSectionProps) {
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Расположение</Text>
      <View style={styles.fieldContainer}>
        <View style={styles.locationHeader}>
          <Text style={styles.fieldLabel}>Координаты</Text>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <Ionicons name="locate" size={18} color={Colors.light.primary} />
            <Text style={styles.locationButtonText}>Получить GPS</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.coordinatesContainer}>
          <View style={[styles.coordinateField, { marginRight: 8 }]}>
            <Text style={styles.coordinateLabel}>Широта:</Text>
            <Text style={styles.coordinateValue}>{latitude || 'Нет данных'}</Text>
          </View>
          <View style={styles.coordinateField}>
            <Text style={styles.coordinateLabel}>Долгота:</Text>
            <Text style={styles.coordinateValue}>{longitude || 'Нет данных'}</Text>
          </View>
        </View>
        {errors?.latitude && <Text style={styles.errorText}>{errors.latitude}</Text>}
      </View>
    </View>
  );
}); 