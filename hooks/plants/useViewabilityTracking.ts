import { useRef, useMemo, useState, useCallback } from 'react';
import { ViewToken } from 'react-native';
import { Specimen } from '@/types';

interface ExtendedViewToken extends ViewToken {
  percentVisible?: number;
}

interface ViewableItemsChanged {
  viewableItems: ExtendedViewToken[];
  changed: ExtendedViewToken[];
}

export function useViewabilityTracking() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentIndexRef = useRef<number>(0);
  
  const onViewableItemsChanged = useCallback(({ viewableItems }: ViewableItemsChanged) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index as number;
      
      if (newIndex !== currentIndexRef.current) {
        currentIndexRef.current = newIndex;
        setCurrentIndex(newIndex);
      }
    }
  }, []);

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300
  }), []);

  return { currentIndex, onViewableItemsChanged, viewabilityConfig };
} 