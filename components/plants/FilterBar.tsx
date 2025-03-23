import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserRole, Specimen, SectorType } from '@/types';

import SearchInput from './SearchInput';
import FilterPanel from './FilterPanel';
import FilterModal from './FilterModal';

import { useFilterLogic } from './hooks/useFilterLogic';
import { useModalData } from './hooks/useModalData';
import { useAnimatedFilters } from './hooks/useAnimatedFilters';

interface FilterBarProps {
  userRole: UserRole;
  onFilter: (filteredData: Specimen[]) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ userRole, onFilter }) => {
  const { 
    activeFilters, 
    searchQuery, 
    handleSearch, 
    clearFilters, 
    selectFilter, 
    getActiveFilterText 
  } = useFilterLogic(onFilter);

  const { 
    showFilters, 
    filtersAnimation, 
    toggleFilters 
  } = useAnimatedFilters();

  const { 
    modalVisible, 
    modalType, 
    openModal, 
    closeModal, 
    getModalData, 
    getActiveItemId 
  } = useModalData();

  const handleSelectFilter = (id: number | SectorType) => {
    selectFilter(modalType, id);
    closeModal();
  };

  const { items, title } = getModalData();
  const activeItemId = getActiveItemId(activeFilters);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F9F9F9']}
        style={styles.containerGradient}
      >
        <SearchInput
          value={searchQuery}
          onChangeText={handleSearch}
          onToggleFilters={toggleFilters}
          showFilters={showFilters}
        />

        {showFilters && (
          <FilterPanel
            activeFilters={activeFilters}
            filtersAnimation={filtersAnimation}
            onOpenFilterModal={openModal}
            onClearFilters={clearFilters}
            getActiveFilterText={getActiveFilterText}
          />
        )}
      </LinearGradient>

      <FilterModal
        visible={modalVisible}
        onClose={closeModal}
        onSelect={handleSelectFilter}
        title={title}
        items={items}
        activeItemId={activeItemId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  containerGradient: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default FilterBar; 