import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface FilterButtonProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isActive: boolean;
  isClearButton?: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({ 
  title, 
  iconName, 
  onPress, 
  isActive, 
  isClearButton = false 
}) => {
  const gradientColors = isClearButton 
    ? ['#FFF5F5', '#FFEBEE'] as const
    : (isActive ? ['#E8F5E9', '#C8E6C9'] as const : ['#FFFFFF', '#F8F8F8'] as const);

  const iconColor = isClearButton 
    ? "#E53935" 
    : (isActive ? "#4CAF50" : "#777");

  return (
    <TouchableOpacity 
      style={[
        styles.filterButton, 
        isActive && styles.activeFilterButton,
        isClearButton && styles.clearButton
      ]} 
      onPress={onPress}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.filterGradient}
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name={iconName} 
            size={16} 
            color={iconColor} 
          />
        </View>
        <Text style={[
          styles.filterText, 
          isActive && styles.activeFilterText,
          isClearButton && styles.clearButtonText
        ]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  activeFilterButton: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  clearButton: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFCDD2',
  },
  filterText: {
    color: '#555',
    fontWeight: '500',
    fontSize: 15,
  },
  activeFilterText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  clearButtonText: {
    color: '#E53935',
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  filterGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
});

export default FilterButton; 