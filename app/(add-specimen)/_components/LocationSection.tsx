import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { Colors } from '@/constants/Colors';
import { LocationType } from '@/types';
import FormField from './FormField';

interface LocationSectionProps {
  latitude: string;
  longitude: string;
  mapId?: string;
  setMapId?: (id: string) => void;
  mapX?: string;
  setMapX?: (x: string) => void;
  mapY?: string;
  setMapY?: (y: string) => void;
  regionId?: string;
  setRegionId?: (id: string) => void;
  locationType: LocationType;
  setLocationType?: (type: LocationType) => void;
  getCurrentLocation: () => Promise<void>;
  errors: Record<string, string>;
}

export const LocationSection = memo(function LocationSectionComponent({
  latitude,
  longitude,
  mapId = "1",
  setMapId,
  mapX = "50",
  setMapX,
  mapY = "50",
  setMapY,
  regionId,
  setRegionId,
  locationType = LocationType.SchematicMap,
  setLocationType,
  getCurrentLocation,
  errors
}: LocationSectionProps) {
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  
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
        {locationType === LocationType.SchematicMap && setMapId && setMapX && setMapY && (
          <View style={styles.coordinatesContainer}>
            <View style={[styles.coordinateField, { marginRight: 8, flex: 1 }]}>
              <FormField
                label="ID карты"
                value={mapId}
                onChangeText={setMapId}
                error={errors?.mapId}
                placeholder="ID"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.coordinateField, { marginRight: 8, flex: 1 }]}>
              <FormField
                label="X"
                value={mapX}
                onChangeText={setMapX}
                error={errors?.mapX}
                placeholder="X"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.coordinateField, { flex: 1 }]}>
               <FormField
                label="Y"
                value={mapY}
                onChangeText={setMapY}
                error={errors?.mapY}
                placeholder="Y"
                keyboardType="numeric"
              />
            </View>
          </View>
        )}
        
        {errors?.latitude && <Text style={styles.errorText}>{errors.latitude}</Text>}
      </View>

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
      {showAdvanced && setRegionId && (
        <View style={{ marginTop: 15 }}>
          <FormField
            label="Регион (ID)"
            value={regionId || ''}
            onChangeText={setRegionId}
            error={errors?.regionId}
            placeholder="Введите ID региона (опционально)"
            keyboardType="numeric"
            leftIcon={<Ionicons name="map-outline" size={20} color={Colors.light.primary} />}
          />
        </View>
      )}
    </View>
  );
}); 

export default LocationSection;
