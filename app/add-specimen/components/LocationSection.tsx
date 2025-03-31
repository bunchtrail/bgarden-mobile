import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { Colors } from '@/constants/Colors';
import { LocationType } from '@/types';

interface LocationSectionProps {
  latitude: string;
  longitude: string;
  mapId?: string;
  mapX?: string;
  mapY?: string;
  locationType: LocationType;
  setLocationType?: (type: LocationType) => void;
  getCurrentLocation: () => Promise<void>;
  errors: Record<string, string>;
}

export const LocationSection = memo(function LocationSectionComponent({
  latitude,
  longitude,
  mapId = "1",
  mapX = "50",
  mapY = "50",
  locationType = LocationType.SchematicMap,
  setLocationType,
  getCurrentLocation,
  errors
}: LocationSectionProps) {
  
  // Функция переключения типа координат
  const toggleLocationType = () => {
    if (setLocationType) {
      setLocationType(
        locationType === LocationType.Geographic 
          ? LocationType.SchematicMap 
          : LocationType.Geographic
      );
    }
  };
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Расположение</Text>
      <View style={styles.fieldContainer}>
        {/* Заголовок с кнопками */}
        <View style={styles.locationHeader}>
          <Text style={styles.fieldLabel}>
            {locationType === LocationType.Geographic ? 'GPS координаты' : 'Координаты на карте'}
          </Text>
          
          <View style={{ flexDirection: 'row' }}>
            {setLocationType && (
              <TouchableOpacity 
                style={[styles.locationButton, { marginRight: 8 }]}
                onPress={toggleLocationType}
              >
                <Ionicons 
                  name={locationType === LocationType.Geographic ? "map-outline" : "navigate-outline"} 
                  size={18} 
                  color={Colors.light.primary} 
                />
                <Text style={styles.locationButtonText}>
                  {locationType === LocationType.Geographic ? 'На карту' : 'На GPS'}
                </Text>
              </TouchableOpacity>
            )}
            
            {locationType === LocationType.Geographic && (
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={getCurrentLocation}
              >
                <Ionicons name="locate" size={18} color={Colors.light.primary} />
                <Text style={styles.locationButtonText}>Получить GPS</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* GPS координаты */}
        {locationType === LocationType.Geographic && (
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
        )}
        
        {/* Схематические координаты */}
        {locationType === LocationType.SchematicMap && (
          <View style={styles.coordinatesContainer}>
            <View style={[styles.coordinateField, { marginRight: 8, flex: 0.7 }]}>
              <Text style={styles.coordinateLabel}>ID карты:</Text>
              <Text style={styles.coordinateValue}>{mapId || '1'}</Text>
            </View>
            <View style={[styles.coordinateField, { marginRight: 8, flex: 0.7 }]}>
              <Text style={styles.coordinateLabel}>X:</Text>
              <Text style={styles.coordinateValue}>{mapX || '50'}</Text>
            </View>
            <View style={[styles.coordinateField, { flex: 0.7 }]}>
              <Text style={styles.coordinateLabel}>Y:</Text>
              <Text style={styles.coordinateValue}>{mapY || '50'}</Text>
            </View>
          </View>
        )}
        
        {errors?.latitude && <Text style={styles.errorText}>{errors.latitude}</Text>}
      </View>
    </View>
  );
}); 