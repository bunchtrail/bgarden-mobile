import { useRef, useMemo, useState } from 'react';
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
  
  const onViewableItemsChanged = useRef(({ viewableItems }: ViewableItemsChanged) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index as number);
      
      if (__DEV__) {
        console.log('ИЗМЕНЕНИЕ ВИДИМОГО ЭЛЕМЕНТА:', { 
          индекс: viewableItems[0].index,
          идентификатор: (viewableItems[0].item as Specimen)?.id
        });
      }
    }
  }).current;

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 200
  }), []);

  return { currentIndex, onViewableItemsChanged, viewabilityConfig };
} 