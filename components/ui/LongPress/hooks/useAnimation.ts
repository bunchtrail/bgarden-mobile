import { useRef } from 'react';
import { Animated } from 'react-native';

export const useAnimation = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  const animateIn = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start(callback);
  };

  const animateOut = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      if (callback) callback();
      
      // Сбрасываем значения анимации
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      slideAnim.setValue(100);
    });
  };

  return {
    animationValues: {
      opacity: fadeAnim,
      scale: scaleAnim,
      slide: slideAnim,
    },
    animateIn,
    animateOut,
  };
}; 