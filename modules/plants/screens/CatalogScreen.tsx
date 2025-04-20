import React, { useEffect, useCallback } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import DebugInfo from '@/components/debug/DebugInfo';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { SCREEN_DIMENSIONS, logScreenDimensions } from '@/app/constants/layoutConstants';
import { useViewabilityTracking } from '@/hooks/plants';
import { FilterBar, PlantsList } from '@/components/plants';
import { usePlantsContext } from '@/modules/plants/context/PlantsContext';
import { EmptyState } from '@/components/common/EmptyState';

// Приблизительная высота таб-бара (можно уточнить или вынести в константы)
const TAB_BAR_HEIGHT = 80; 

export default function CatalogScreen() {
  const router = useRouter();
  const { filteredSpecimens, loading, error, userRole, refreshData } = usePlantsContext();
  const { currentIndex, onViewableItemsChanged, viewabilityConfig } = useViewabilityTracking();

  // Эффект загрузки данных при монтировании компонента
  useEffect(() => {
    logScreenDimensions();
    
    // Загружаем данные только при первом рендере
    const loadInitialData = async () => {
      await refreshData();
    };
    
    loadInitialData();
    
    // Эффект очистки при размонтировании
    return () => {
      // Очистка ресурсов, если необходимо
    };
  }, []); // Удаляем refreshData из зависимостей для загрузки только при монтировании

  // Логирование изменений в данных (отключено для продакшн)
  useEffect(() => {
    // Отключаем логирование в продакшн-режиме

  }, [filteredSpecimens]);

  const navigateToPlantDetails = useCallback((id: number) => {
    try {
      router.push({
        pathname: "/plant-details/[id]",
        params: { id: id.toString() }
      });
    } catch {
      // Обработка ошибки навигации, если необходимо
    }
  }, [router]);

  const handleFilter = useCallback(() => {
    // Фильтрация происходит в контексте
  }, []);

  const handleRetry = useCallback(() => {
    // Повторная загрузка данных
    refreshData();
  }, [refreshData]);

  if (loading) {
    return <LoadingIndicator />;
  }

  // Отображение сообщения об ошибке с возможностью повторить запрос
  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <ThemedText style={styles.errorTitle}>Произошла ошибка</ThemedText>
        <ThemedText style={styles.errorMessage}>{error}</ThemedText>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={handleRetry}
          activeOpacity={0.7}
        >
          <Text style={styles.retryButtonText}>Повторить загрузку</Text>
        </TouchableOpacity>
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>Режим разработчика</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // Сообщение, если список пуст
  if (filteredSpecimens.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <StatusBar style="light" />
          <View>
            <FilterBar userRole={userRole} onFilter={handleFilter} />
          </View>
          
          <EmptyState message="Растения не найдены">
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={handleRetry}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>Обновить каталог</Text>
            </TouchableOpacity>
          </EmptyState>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <StatusBar style="light" />
        <View>
          <FilterBar userRole={userRole} onFilter={handleFilter} />
        </View>
        
        <DebugInfo 
          width={SCREEN_DIMENSIONS.width} 
          height={SCREEN_DIMENSIONS.height} 
          currentIndex={currentIndex} 
          totalItems={filteredSpecimens.length} 
        />
        
        {__DEV__ && (
          <View style={styles.debugBoundary} />
        )}
        
        <PlantsList
          specimens={filteredSpecimens}
          currentIndex={currentIndex}
          userRole={userRole}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onItemPress={navigateToPlantDetails}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: TAB_BAR_HEIGHT,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  debugBoundary: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: 'red',
    zIndex: 999
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#d32f2f',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
  },
  retryButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
  },
}); 