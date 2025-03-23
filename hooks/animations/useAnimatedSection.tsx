import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

/**
 * Хук для создания анимированного появления секции с эффектом fade и translate
 * @param delay Задержка начала анимации в миллисекундах
 * @returns Объект с анимированными стилями
 */
export function useAnimatedSection(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, [delay, opacity, translateY]);
  
  return {
    animatedStyle: {
      opacity,
      transform: [{ translateY }],
    }
  };
} 