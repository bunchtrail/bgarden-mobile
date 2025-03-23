import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Specimen, UserRole, SectorType, SpecimenFilterParams, Family, Region, Exposition } from '@/types';
import { mockSpecimens, mockFamilies, mockRegions, mockExpositions } from '@/data/mockData';

interface FilterBarProps {
  userRole: UserRole;
  onFilter: (filteredData: Specimen[]) => void;
}

// Тип для элемента в модальном окне
interface ModalItem {
  id: number | SectorType;
  name: string;
  [key: string]: string | number | SectorType;
}

const FilterBar: React.FC<FilterBarProps> = ({ userRole, onFilter }) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<SpecimenFilterParams>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  
  const searchInputRef = useRef<TextInput>(null);
  const filtersAnimation = useRef(new Animated.Value(0)).current;

  const toggleFilters = () => {
    if (!showFilters) {
      setShowFilters(true);
      Animated.timing(filtersAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(filtersAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false
      }).start(() => {
        setShowFilters(false);
      });
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    applyFilters({ ...activeFilters, searchValue: text });
  };

  const openModal = (type: string) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const applyFilters = (filters: SpecimenFilterParams) => {
    setActiveFilters(filters);

    let filteredData = [...mockSpecimens];

    if (filters.searchValue) {
      const query = filters.searchValue.toLowerCase();
      filteredData = filteredData.filter(
        (specimen) => 
          specimen.russianName.toLowerCase().includes(query) ||
          specimen.latinName.toLowerCase().includes(query) ||
          specimen.familyName.toLowerCase().includes(query)
      );
    }

    if (filters.familyId !== undefined) {
      filteredData = filteredData.filter(specimen => specimen.familyId === filters.familyId);
    }

    if (filters.sectorType !== undefined) {
      filteredData = filteredData.filter(specimen => specimen.sectorType === filters.sectorType);
    }

    if (filters.regionId !== undefined) {
      filteredData = filteredData.filter(specimen => specimen.regionId === filters.regionId);
    }

    if (filters.expositionId !== undefined) {
      filteredData = filteredData.filter(specimen => specimen.expositionId === filters.expositionId);
    }

    onFilter(filteredData);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilters({});
    onFilter(mockSpecimens);
  };

  const selectFilter = (id: number | SectorType) => {
    let newFilters = { ...activeFilters };
    
    switch (modalType) {
      case 'family':
        newFilters.familyId = id as number;
        break;
      case 'sector':
        newFilters.sectorType = id as SectorType;
        break;
      case 'region':
        newFilters.regionId = id as number;
        break;
      case 'exposition':
        newFilters.expositionId = id as number;
        break;
    }
    
    closeModal();
    applyFilters(newFilters);
  };

  const renderModalContent = () => {
    let data: ModalItem[] = [];
    let titleKey = 'name';
    let titleText = '';

    switch (modalType) {
      case 'family':
        data = mockFamilies as ModalItem[];
        titleText = 'Выберите семейство';
        break;
      case 'sector':
        data = [
          { id: SectorType.Dendrology, name: 'Дендрология' },
          { id: SectorType.Flora, name: 'Флора' },
          { id: SectorType.Flowering, name: 'Цветение' }
        ];
        titleText = 'Выберите сектор';
        break;
      case 'region':
        data = mockRegions as ModalItem[];
        titleText = 'Выберите регион';
        break;
      case 'exposition':
        data = mockExpositions as ModalItem[];
        titleText = 'Выберите экспозицию';
        break;
    }

    // Получаем ID текущего активного фильтра для данного типа
    let activeItemId: number | SectorType | undefined;
    switch (modalType) {
      case 'family':
        activeItemId = activeFilters.familyId;
        break;
      case 'sector':
        activeItemId = activeFilters.sectorType;
        break;
      case 'region':
        activeItemId = activeFilters.regionId;
        break;
      case 'exposition':
        activeItemId = activeFilters.expositionId;
        break;
    }

    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{titleText}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Ionicons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isSelected = item.id === activeItemId;
            return (
              <TouchableOpacity
                style={[styles.modalItem, isSelected && styles.selectedModalItem]}
                onPress={() => selectFilter(item.id)}
              >
                <Text style={[styles.modalItemText, isSelected && styles.selectedModalItemText]}>
                  {item[titleKey]}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={20} color="#4CAF50" />
                )}
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalList}
        />
      </View>
    );
  };

  const getActiveFilterText = (type: string): string => {
    switch (type) {
      case 'family':
        if (activeFilters.familyId !== undefined) {
          const family = mockFamilies.find(f => f.id === activeFilters.familyId);
          return family ? family.name : '';
        }
        return '';
      case 'sector':
        if (activeFilters.sectorType !== undefined) {
          switch (activeFilters.sectorType) {
            case SectorType.Dendrology: return 'Дендрология';
            case SectorType.Flora: return 'Флора';
            case SectorType.Flowering: return 'Цветение';
          }
        }
        return '';
      case 'region':
        if (activeFilters.regionId !== undefined) {
          const region = mockRegions.find(r => r.id === activeFilters.regionId);
          return region ? region.name : '';
        }
        return '';
      case 'exposition':
        if (activeFilters.expositionId !== undefined) {
          const exposition = mockExpositions.find(e => e.id === activeFilters.expositionId);
          return exposition ? exposition.name : '';
        }
        return '';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F9F9F9']}
        style={styles.containerGradient}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchInner}>
            <Ionicons name="search" size={20} color="#4CAF50" style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Поиск растений..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#999"
            />
            <TouchableOpacity 
              style={styles.optionsButton} 
              onPress={toggleFilters}
            >
              <Ionicons 
                name={showFilters ? "options" : "options-outline"} 
                size={24} 
                color={showFilters ? "#4CAF50" : "#777"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {showFilters && (
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
              <TouchableOpacity 
                style={[styles.filterButton, activeFilters.familyId !== undefined && styles.activeFilterButton]} 
                onPress={() => openModal('family')}
              >
                <LinearGradient
                  colors={activeFilters.familyId !== undefined ? 
                    ['#E8F5E9', '#C8E6C9'] : 
                    ['#FFFFFF', '#F8F8F8']}
                  style={styles.filterGradient}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons 
                      name="leaf-outline" 
                      size={16} 
                      color={activeFilters.familyId !== undefined ? "#4CAF50" : "#777"} 
                    />
                  </View>
                  <Text style={[
                    styles.filterText, 
                    activeFilters.familyId !== undefined && styles.activeFilterText
                  ]}>
                    {activeFilters.familyId !== undefined 
                      ? getActiveFilterText('family') 
                      : 'Семейство'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterButton, activeFilters.sectorType !== undefined && styles.activeFilterButton]} 
                onPress={() => openModal('sector')}
              >
                <LinearGradient
                  colors={activeFilters.sectorType !== undefined ? 
                    ['#E8F5E9', '#C8E6C9'] : 
                    ['#FFFFFF', '#F8F8F8']}
                  style={styles.filterGradient}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons 
                      name="grid-outline" 
                      size={16} 
                      color={activeFilters.sectorType !== undefined ? "#4CAF50" : "#777"} 
                    />
                  </View>
                  <Text style={[
                    styles.filterText, 
                    activeFilters.sectorType !== undefined && styles.activeFilterText
                  ]}>
                    {activeFilters.sectorType !== undefined 
                      ? getActiveFilterText('sector') 
                      : 'Сектор'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterButton, activeFilters.regionId !== undefined && styles.activeFilterButton]} 
                onPress={() => openModal('region')}
              >
                <LinearGradient
                  colors={activeFilters.regionId !== undefined ? 
                    ['#E8F5E9', '#C8E6C9'] : 
                    ['#FFFFFF', '#F8F8F8']}
                  style={styles.filterGradient}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons 
                      name="map-outline" 
                      size={16} 
                      color={activeFilters.regionId !== undefined ? "#4CAF50" : "#777"} 
                    />
                  </View>
                  <Text style={[
                    styles.filterText, 
                    activeFilters.regionId !== undefined && styles.activeFilterText
                  ]}>
                    {activeFilters.regionId !== undefined 
                      ? getActiveFilterText('region') 
                      : 'Регион'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterButton, activeFilters.expositionId !== undefined && styles.activeFilterButton]} 
                onPress={() => openModal('exposition')}
              >
                <LinearGradient
                  colors={activeFilters.expositionId !== undefined ? 
                    ['#E8F5E9', '#C8E6C9'] : 
                    ['#FFFFFF', '#F8F8F8']}
                  style={styles.filterGradient}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons 
                      name="compass-outline" 
                      size={16} 
                      color={activeFilters.expositionId !== undefined ? "#4CAF50" : "#777"} 
                    />
                  </View>
                  <Text style={[
                    styles.filterText, 
                    activeFilters.expositionId !== undefined && styles.activeFilterText
                  ]}>
                    {activeFilters.expositionId !== undefined 
                      ? getActiveFilterText('exposition') 
                      : 'Экспозиция'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              {(activeFilters.familyId !== undefined || 
                activeFilters.sectorType !== undefined || 
                activeFilters.regionId !== undefined || 
                activeFilters.expositionId !== undefined ||
                activeFilters.searchValue) && (
                <TouchableOpacity 
                  style={[styles.filterButton, styles.clearButton]} 
                  onPress={clearFilters}
                >
                  <LinearGradient
                    colors={['#FFF5F5', '#FFEBEE']}
                    style={styles.filterGradient}
                  >
                    <View style={styles.iconContainer}>
                      <Ionicons name="close-circle-outline" size={16} color="#E53935" />
                    </View>
                    <Text style={[styles.filterText, styles.clearButtonText]}>Сбросить</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </ScrollView>
          </Animated.View>
        )}
      </LinearGradient>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        {renderModalContent()}
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
    color: '#4CAF50',
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  filtersContainer: {
    marginTop: 15,
    marginBottom: 8,
  },
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
  filterText: {
    color: '#555',
    fontWeight: '500',
    fontSize: 15,
  },
  clearButton: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFCDD2',
  },
  clearButtonText: {
    color: '#E53935',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  modalList: {
    paddingBottom: 30,
  },
  modalItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedModalItem: {
    backgroundColor: '#F9FFF9',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedModalItemText: {
    color: '#4CAF50',
    fontWeight: '600',
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
  activeFilterText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  optionsButton: {
    padding: 8,
    borderRadius: 20,
  },
  containerGradient: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  filterGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
});

export default FilterBar; 