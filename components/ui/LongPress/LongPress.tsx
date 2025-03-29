import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Pressable,
  Animated,
  Dimensions,
  ViewStyle,
  ScaledSize
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
}

interface LongPressProps {
  children: React.ReactNode;
  actions: ActionItem[];
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  longPressDuration?: number;
  actionMenuPosition?: 'top' | 'bottom' | 'auto';
}

// Тип для стиля анимированного представления
type AnimatedViewStyle = Animated.WithAnimatedValue<ViewStyle>;

export const LongPress: React.FC<LongPressProps> = ({
  children,
  actions,
  onPress,
  onPressIn,
  onPressOut,
  longPressDuration = 500,
  actionMenuPosition = 'auto'
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const elementRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  
  const backgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  
  // Получаем размеры экрана для динамического расчёта ширины меню
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const screenWidth = screenDimensions.width;
  
  // Логируем текущие размеры экрана при инициализации компонента
  useEffect(() => {
    const dimensions = Dimensions.get('window');
    console.log('[LongPress] Размеры экрана:', {
      width: dimensions.width,
      height: dimensions.height,
      scale: dimensions.scale,
      fontScale: dimensions.fontScale
    });
    
    // Создаем обработчик изменения размеров экрана
    const dimensionsChangeHandler = ({ window }: { window: ScaledSize }) => {
      console.log('[LongPress] Изменение размеров экрана:', {
        width: window.width,
        height: window.height,
        scale: window.scale,
        fontScale: window.fontScale
      });
      setScreenDimensions(window);
    };
    
    // Подписываемся на изменение размеров экрана
    Dimensions.addEventListener('change', dimensionsChangeHandler);
    
    // Отписываемся при размонтировании компонента
    return () => {
      // Для React Native >= 0.65
      // Dimensions.removeEventListener('change', dimensionsChangeHandler);
      // Для более новых версий React Native event listener API изменился
    };
  }, []);
  
  // Логируем состояние видимости модального окна
  useEffect(() => {
    console.log('[LongPress] Состояние модального окна:', { 
      visible: modalVisible,
      screenWidth
    });
  }, [modalVisible, screenWidth]);

  const handleLongPress = () => {
    console.log('[LongPress] Длительное нажатие активировано, открываем меню');
    // Показываем модальное окно
    setModalVisible(true);
    
    // Запускаем анимацию появления
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
    ]).start(() => {
      console.log('[LongPress] Анимация появления меню завершена');
    });
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const handlePressIn = () => {
    if (onPressIn) {
      onPressIn();
    }
  };

  const handlePressOut = () => {
    if (onPressOut) {
      onPressOut();
    }
  };

  const closeMenu = () => {
    console.log('[LongPress] Закрываем меню');
    // Запускаем анимацию скрытия
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
      setModalVisible(false);
      // Сбрасываем значения анимации
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      slideAnim.setValue(100);
      console.log('[LongPress] Анимация скрытия меню завершена');
    });
  };

  const handleActionPress = (action: ActionItem) => {
    console.log(`[LongPress] Нажата опция меню: ${action.label} (id: ${action.id})`);
    closeMenu();
    action.onPress();
  };

  const renderActionMenu = () => {
    if (!modalVisible) return null;

    // Логируем параметры меню при рендеринге
    console.log('[LongPress] Рендеринг меню с параметрами:', {
      actionsCount: actions.length,
      screenWidth,
      menuStyle: {
        width: '100%',
        alignSelf: 'stretch'
      }
    });

    return (
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeMenu}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View 
          style={styles.modalOverlay}
          onLayout={(event) => {
            const { width, height, x, y } = event.nativeEvent.layout;
            console.log('[LongPress] Размеры оверлея:', { width, height, x, y });
          }}
        >
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.touchableArea} />
          </TouchableWithoutFeedback>
          
          <Animated.View 
            style={[
              styles.bottomMenuWrapper, 
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim }
                ],
              }
            ]}
          >
            <View 
              style={[styles.bottomMenuContainer, { backgroundColor }]}
              onLayout={(event) => {
                const { width, height, x, y } = event.nativeEvent.layout;
                console.log('[LongPress] Размеры белого фона меню:', { 
                  width, 
                  height, 
                  x, 
                  y,
                  screenWidth,
                  difference: screenWidth - width,
                  styleWidth: '100%'
                });
              }}
            >
              {actions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionItem}
                  onPress={() => handleActionPress(action)}
                  activeOpacity={0.7}
                  onLayout={(event) => {
                    if (action.id === actions[0].id) {
                      const { width, x } = event.nativeEvent.layout;
                      console.log('[LongPress] Размеры первого элемента меню:', { 
                        width, 
                        x, 
                        rightEdge: x + width,
                        screenWidth
                      });
                    }
                  }}
                >
                  {action.icon && (
                    <View style={styles.actionIcon}>{action.icon}</View>
                  )}
                  <ThemedText style={styles.actionLabel}>{action.label}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <Pressable
        ref={elementRef}
        onLongPress={handleLongPress}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        delayLongPress={longPressDuration}
      >
        {children}
      </Pressable>
      {renderActionMenu()}
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    alignItems: 'stretch', 
    width: '100%',
  },
  touchableArea: {
    flex: 1,
  },
  bottomMenuWrapper: {
    width: '100%',
    alignSelf: 'stretch',
  },
  bottomMenuContainer: {
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  menuContainer: {
    position: 'absolute',
    minWidth: 150,
    borderRadius: 8,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionLabel: {
    fontSize: 16,
  },
}); 