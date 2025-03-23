import { useState, useRef, useCallback } from 'react';
import { Animated } from 'react-native';

export function useAnimatedFilters() {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const filtersAnimation = useRef(new Animated.Value(0)).current;

  const toggleFilters = useCallback(() => {
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
  }, [showFilters, filtersAnimation]);

  return {
    showFilters,
    filtersAnimation,
    toggleFilters
  };
} 