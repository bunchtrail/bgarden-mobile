import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

interface AnimationConfig {
  friction?: number;
  tension?: number;
  duration?: number;
  useNativeDriver?: boolean;
}

interface UseAnimationOptions {
  initialValue?: number;
  config?: AnimationConfig;
}

export const useAnimation = (options: UseAnimationOptions = {}) => {
  const { 
    initialValue = 0,
    config = {
      friction: 8,
      tension: 40,
      useNativeDriver: true
    }
  } = options;
  
  const animation = useRef(new Animated.Value(initialValue)).current;

  // Анимация открытия (значение 1)
  const animateOpen = (callback?: () => void) => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: config.useNativeDriver ?? true,
      friction: config.friction ?? 8,
      tension: config.tension ?? 40
    }).start(() => {
      if (callback) callback();
    });
  };

  // Анимация закрытия (значение 0)
  const animateClose = (callback?: () => void) => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: config.useNativeDriver ?? true,
      friction: config.friction ?? 8,
      tension: config.tension ?? 40
    }).start(() => {
      if (callback) callback();
    });
  };

  // Анимирование значения к указанному числу
  const animateTo = (value: number, callback?: () => void) => {
    Animated.spring(animation, {
      toValue: value,
      useNativeDriver: config.useNativeDriver ?? true,
      friction: config.friction ?? 8,
      tension: config.tension ?? 40
    }).start(() => {
      if (callback) callback();
    });
  };

  // Хук для автоматической анимации при изменении isOpen
  const useAnimateOnChange = (isOpen: boolean) => {
    useEffect(() => {
      if (isOpen) {
        animateOpen();
      } else {
        animateClose();
      }
    }, [isOpen]);
  };

  return {
    animation,
    animateOpen,
    animateClose,
    animateTo,
    useAnimateOnChange,
    interpolate: (config: Animated.InterpolationConfigType) => animation.interpolate(config)
  };
};

export default useAnimation; 