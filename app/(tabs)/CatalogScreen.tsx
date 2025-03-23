import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, FlatList, Dimensions, ActivityIndicator, ViewToken, Platform, View, Text, LayoutChangeEvent, findNodeHandle, UIManager, ScaledSize, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Specimen, UserRole, SectorType, SpecimenFilterParams } from '@/types';
import PlantCard from '@/components/plants/PlantCard';
import FilterBar from '@/components/plants/FilterBar';
import { mockSpecimens } from '@/data/mockData';

const { width, height } = Dimensions.get('window');

// Фиксированные высоты элементов интерфейса
const TAB_BAR_HEIGHT = 80; // Высота панели вкладок
const HEADER_HEIGHT = 60; // Высота заголовка
const FILTER_BAR_HEIGHT = 60; // Высота компонента фильтрации
const BOTTOM_MARGIN = 50; // Увеличенный отступ снизу для предотвращения перекрытия
const SAFETY_MARGIN = 20; // Дополнительный запас на всякий случай

// Фиксированная высота карточки - больше не меняется во время выполнения
const FIXED_CARD_HEIGHT = height - TAB_BAR_HEIGHT - HEADER_HEIGHT - FILTER_BAR_HEIGHT - BOTTOM_MARGIN - SAFETY_MARGIN;

// Логирование размеров экрана и фиксированной высоты карточки
console.log('РАЗМЕРЫ ЭКРАНА И ФИКСИРОВАННАЯ ВЫСОТА:', { 
  экранВысота: height, 
  экранШирина: width,
  фиксированнаяВысотаКарточки: FIXED_CARD_HEIGHT,
  вычеты: {
    панельВкладок: TAB_BAR_HEIGHT,
    заголовок: HEADER_HEIGHT,
    фильтры: FILTER_BAR_HEIGHT,
    запасБезопасности: SAFETY_MARGIN,
    отступСнизу: BOTTOM_MARGIN,
    общийВычет: TAB_BAR_HEIGHT + HEADER_HEIGHT + FILTER_BAR_HEIGHT + BOTTOM_MARGIN + SAFETY_MARGIN
  }
});

// Расширяем интерфейс ViewToken дополнительным свойством percentVisible
interface ExtendedViewToken extends ViewToken {
  percentVisible?: number;
}

// Обновленный тип для обработчика видимых элементов
interface ViewableItemsChanged {
  viewableItems: ExtendedViewToken[];
  changed: ExtendedViewToken[];
}

export default function CatalogScreen() {
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [filterParams, setFilterParams] = useState<SpecimenFilterParams>({});
  const [viewMeasurements, setViewMeasurements] = useState({
    title: { width: 0, height: 0, x: 0, y: 0 },
    filterBar: { width: 0, height: 0, x: 0, y: 0 },
    flatList: { width: 0, height: 0, x: 0, y: 0 },
    tabBar: { width: 0, height: 0, x: 0, y: 0 },
    screen: { width, height }
  });
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const userRole = UserRole.Client; 

  // Мемоизированная функция getItemLayout для оптимизации рендеринга списка
  const getItemLayout = useCallback((_data: unknown, index: number) => ({
    length: FIXED_CARD_HEIGHT,
    offset: FIXED_CARD_HEIGHT * index,
    index,
  }), []);

  useEffect(() => {
    loadSpecimens();
  }, [filterParams]);

  useEffect(() => {
    // Логирование при монтировании компонента
    console.log('КОМПОНЕНТ МОНТИРОВАН');
    console.log('ПАРАМЕТРЫ FLATLIST:', {
      snapToInterval: FIXED_CARD_HEIGHT,
      snapToAlignment: 'start',
      pagingEnabled: true,
      фиксированнаяВысотаКарточки: FIXED_CARD_HEIGHT
    });
    
    // Устанавливаем положение панели вкладок
    const tabBarY = height - TAB_BAR_HEIGHT;
    setViewMeasurements(prev => ({
      ...prev,
      tabBar: { width, height: TAB_BAR_HEIGHT, x: 0, y: tabBarY }
    }));
    
    return () => {
      console.log('КОМПОНЕНТ РАЗМОНТИРОВАН');
    };
  }, []);

  const loadSpecimens = async () => {
    setLoading(true);
    
    try {
      // Временное решение с использованием моковых данных
      setTimeout(() => {
        // Применение фильтрации при необходимости
        let filteredData = [...mockSpecimens];
        
        if (filterParams.familyId) {
          filteredData = filteredData.filter(s => s.familyId === filterParams.familyId);
        }
        
        if (filterParams.sectorType !== undefined) {
          filteredData = filteredData.filter(s => s.sectorType === filterParams.sectorType);
        }
        
        if (filterParams.regionId) {
          filteredData = filteredData.filter(s => s.regionId === filterParams.regionId);
        }
        
        if (filterParams.expositionId) {
          filteredData = filteredData.filter(s => s.expositionId === filterParams.expositionId);
        }
        
        if (filterParams.searchValue && filterParams.searchField) {
          const searchValue = filterParams.searchValue.toLowerCase();
          filteredData = filteredData.filter(s => {
            const field = filterParams.searchField as string;
            const fieldValue = s[field as keyof Specimen]?.toString().toLowerCase();
            return fieldValue?.includes(searchValue);
          });
        }
        
        console.log('ЗАГРУЖЕНО РАСТЕНИЙ:', filteredData.length);
        setSpecimens(filteredData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setLoading(false);
    }
  };

  // Оптимизированный обработчик изменения видимых элементов
  const onViewableItemsChanged = useRef(({ viewableItems }: ViewableItemsChanged) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index as number);
      
      // Упрощенное логирование только в режиме разработки
      if (__DEV__) {
        console.log('ИЗМЕНЕНИЕ ВИДИМОГО ЭЛЕМЕНТА:', { 
          индекс: viewableItems[0].index,
          идентификатор: (viewableItems[0].item as Specimen)?.id
        });
      }
    }
  }).current;

  // Мемоизируем конфигурацию видимости для избежания пересоздания
  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 200 // Увеличенное время для уменьшения частоты событий
  }), []);

  const navigateToPlantDetails = (id: number) => {
    try {
      router.push({
        pathname: "/plant-details/[id]",
        params: { id: id.toString() }
      });
    } catch (error) {
      console.log('Требуется реализовать экран PlantDetails для ID:', id);
    }
  };

  // Рендер карточки с фиксированной высотой
  const renderItem = ({ item, index }: { item: Specimen; index: number }) => {
    // Фиксированная высота карточки без динамических изменений
    return (
      <View style={{ height: FIXED_CARD_HEIGHT }}>
        <PlantCard 
          specimen={item} 
          isActive={index === currentIndex} 
          userRole={userRole}
          onPress={() => navigateToPlantDetails(item.id)}
          height={FIXED_CARD_HEIGHT}
        />
      </View>
    );
  };

  const handleFilter = (filteredData: Specimen[]) => {
    setSpecimens(filteredData);
  };

  // Отладочная информация 
  const renderDebugInfo = () => {
    if (!__DEV__) return null;
    
    return (
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          Экран: {width}x{height}{'\n'}
          Карточка: {FIXED_CARD_HEIGHT}px{'\n'}
          Индекс: {currentIndex}/{specimens.length}{'\n'}
          TabBar отступ: {TAB_BAR_HEIGHT}px{'\n'}
          Нижний отступ: {BOTTOM_MARGIN}px
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <StatusBar style="light" />
        <ThemedText style={styles.title}>
          Каталог растений
        </ThemedText>
        <View>
          <FilterBar userRole={userRole} onFilter={handleFilter} />
        </View>
        
        {/* Отладочная информация */}
        {renderDebugInfo()}
        
        {/* Индикатор верхней границы панели вкладок */}
        {__DEV__ && (
          <View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 2,
            backgroundColor: 'red',
            zIndex: 999
          }} />
        )}
        
        <FlatList
          ref={flatListRef}
          data={specimens}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          snapToInterval={FIXED_CARD_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          pagingEnabled
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          contentContainerStyle={{ paddingBottom: BOTTOM_MARGIN }}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={5}
          getItemLayout={getItemLayout}
          removeClippedSubviews={Platform.OS === 'android'} // Только для Android
          updateCellsBatchingPeriod={50}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  filterBar: {
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  debugInfo: {
    position: 'absolute',
    top: 90,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 5,
    borderRadius: 5,
    zIndex: 1000,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
  }
}); 