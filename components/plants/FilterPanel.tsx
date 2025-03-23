import React from 'react';
import { ScrollView, Animated, StyleSheet } from 'react-native';
import { SectorType, SpecimenFilterParams } from '@/types';
import FilterButton from './FilterButton';

interface FilterPanelProps {
  activeFilters: SpecimenFilterParams;
  filtersAnimation: Animated.Value;
  onOpenFilterModal: (type: string) => void;
  onClearFilters: () => void;
  getActiveFilterText: (type: string) => string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  activeFilters, 
  filtersAnimation, 
  onOpenFilterModal, 
  onClearFilters,
  getActiveFilterText 
}) => {
  const showClearButton = 
    activeFilters.familyId !== undefined || 
    activeFilters.sectorType !== undefined || 
    activeFilters.regionId !== undefined || 
    activeFilters.expositionId !== undefined || 
    activeFilters.searchValue;

  return (
    <Animated.View 
      style={[
        styles.filtersContainer, 
        {
          opacity: filtersAnimation,
          maxHeight: filtersAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100]
          }),
          transform: [{
            translateY: filtersAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0]
            })
          }]
        }
      ]}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <FilterButton 
          title={activeFilters.familyId !== undefined ? getActiveFilterText('family') : 'Семейство'}
          iconName="leaf-outline"
          onPress={() => onOpenFilterModal('family')}
          isActive={activeFilters.familyId !== undefined}
        />
        
        <FilterButton 
          title={activeFilters.sectorType !== undefined ? getActiveFilterText('sector') : 'Сектор'}
          iconName="grid-outline"
          onPress={() => onOpenFilterModal('sector')}
          isActive={activeFilters.sectorType !== undefined}
        />
        
        <FilterButton 
          title={activeFilters.regionId !== undefined ? getActiveFilterText('region') : 'Регион'}
          iconName="map-outline"
          onPress={() => onOpenFilterModal('region')}
          isActive={activeFilters.regionId !== undefined}
        />
        
        <FilterButton 
          title={activeFilters.expositionId !== undefined ? getActiveFilterText('exposition') : 'Экспозиция'}
          iconName="compass-outline"
          onPress={() => onOpenFilterModal('exposition')}
          isActive={activeFilters.expositionId !== undefined}
        />
        
        {showClearButton && (
          <FilterButton 
            title="Сбросить"
            iconName="close-circle-outline"
            onPress={onClearFilters}
            isActive={false}
            isClearButton={true}
          />
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    marginTop: 15,
    marginBottom: 8,
  },
});

export default FilterPanel; 