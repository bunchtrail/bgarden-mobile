import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { UserRole, Specimen } from '@/types';
import FilterBar from '@/components/plants/FilterBar';
import { SCREEN_DIMENSIONS, logScreenDimensions } from '@/app/constants/layoutConstants';
import { useSpecimensData } from '@/app/hooks/useSpecimensData';
import { useViewabilityTracking } from '@/app/hooks/useViewabilityTracking';
import LoadingIndicator from '@/app/components/common/LoadingIndicator';
import DebugInfo from '@/app/components/debug/DebugInfo';
import PlantsList from '@/app/components/plants/PlantsList';

export default function CatalogScreen() {
  const router = useRouter();
  const userRole = UserRole.Client;
  const { specimens, loading, setFilterParams } = useSpecimensData();
  const { currentIndex, onViewableItemsChanged, viewabilityConfig } = useViewabilityTracking();

  useEffect(() => {
    logScreenDimensions();
    console.log('КОМПОНЕНТ МОНТИРОВАН');
    
    return () => {
      console.log('КОМПОНЕНТ РАЗМОНТИРОВАН');
    };
  }, []);

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

  const handleFilter = (filteredData: Specimen[]) => {
    // Можно расширить логику фильтрации если нужно
  };

  if (loading) {
    return <LoadingIndicator />;
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
        
        <DebugInfo 
          width={SCREEN_DIMENSIONS.width} 
          height={SCREEN_DIMENSIONS.height} 
          currentIndex={currentIndex} 
          totalItems={specimens.length} 
        />
        
        {__DEV__ && (
          <View style={styles.debugBoundary} />
        )}
        
        <PlantsList
          specimens={specimens}
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
  }
}); 