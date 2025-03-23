import React, { useRef, useCallback } from 'react';
import { FlatList, Platform, View, ViewabilityConfig, ViewabilityConfigCallbackPair } from 'react-native';
import { Specimen, UserRole } from '@/types';
import PlantCard from './PlantCard';
import { FIXED_CARD_HEIGHT, BOTTOM_MARGIN } from '@/app/constants/layoutConstants';

interface PlantsListProps {
  specimens: Specimen[];
  currentIndex: number;
  userRole: UserRole;
  onViewableItemsChanged: ViewabilityConfigCallbackPair["onViewableItemsChanged"];
  viewabilityConfig: ViewabilityConfig;
  onItemPress: (id: number) => void;
}

const PlantsList = ({
  specimens,
  currentIndex,
  userRole,
  onViewableItemsChanged,
  viewabilityConfig,
  onItemPress
}: PlantsListProps) => {
  const flatListRef = useRef<FlatList>(null);

  const getItemLayout = useCallback((_data: unknown, index: number) => ({
    length: FIXED_CARD_HEIGHT,
    offset: FIXED_CARD_HEIGHT * index,
    index,
  }), []);

  const renderItem = ({ item, index }: { item: Specimen; index: number }) => (
    <View style={{ height: FIXED_CARD_HEIGHT }}>
      <PlantCard 
        specimen={item} 
        isActive={index === currentIndex} 
        userRole={userRole}
        onPress={() => onItemPress(item.id)}
        height={FIXED_CARD_HEIGHT}
      />
    </View>
  );

  return (
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
      removeClippedSubviews={Platform.OS === 'android'}
      updateCellsBatchingPeriod={50}
    />
  );
};

export default React.memo(PlantsList); 