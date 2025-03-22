import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Text,
  Platform,
  Dimensions
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
  position?: 'top' | 'bottom';
  style?: StyleProp<ViewStyle>;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const Toast = React.memo(({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'bottom',
  style,
}: ToastProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const [isVisible, setIsVisible] = useState(visible);
  
  const backgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  
  // Определение цвета индикатора в зависимости от типа уведомления
  const indicatorColor = React.useMemo(() => {
    switch (type) {
      case 'success':
        return '#4ADE80';
      case 'error':
        return '#F87171';
      case 'warning':
        return '#FBBF24';
      case 'info':
      default:
        return primaryColor;
    }
  }, [type, primaryColor]);
  
  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;
    
    if (visible) {
      setIsVisible(true);
      // Показываем Toast
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Скрываем Toast через указанное время
      hideTimeout = setTimeout(() => {
        hideToast();
      }, duration);
    } else {
      // Скрываем Toast при изменении видимости
      hideToast();
    }
    
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [visible, duration]);
  
  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    });
  };
  
  // Позиция Toast в зависимости от prop position
  const positionStyle = {
    [position]: Platform.OS === 'ios' ? 50 : 30,
  };
  
  // Проверка видимости на основе локального состояния
  if (!isVisible) {
    return null;
  }
  
  return (
    <Animated.View
      style={[
        styles.container,
        positionStyle,
        {
          opacity,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={hideToast}
        style={[
          styles.toast,
          { backgroundColor },
        ]}
      >
        <View style={[styles.indicator, { backgroundColor: indicatorColor }]} />
        <Text
          style={[
            styles.message,
            { color: textColor },
          ]}
          numberOfLines={2}
        >
          {message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

Toast.displayName = 'Toast';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 50,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  indicator: {
    width: 4,
    height: '80%',
    borderRadius: 2,
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
}); 