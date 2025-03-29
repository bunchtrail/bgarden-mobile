import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Pressable,
  Animated,
  Dimensions,
  ViewStyle
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
  longPressDuration?: number;
  actionMenuPosition?: 'top' | 'bottom' | 'auto';
}

// Тип для стиля анимированного представления
type AnimatedViewStyle = Animated.WithAnimatedValue<ViewStyle>;

export const LongPress: React.FC<LongPressProps> = ({
  children,
  actions,
  onPress,
  longPressDuration = 500,
  actionMenuPosition = 'auto'
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [menuPlacement, setMenuPlacement] = useState<'top' | 'bottom'>('bottom');
  const elementRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  const backgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');

  const handleLongPress = () => {
    if (elementRef.current) {
      elementRef.current.measureInWindow((x, y, width, height) => {
        // Сохраняем позицию элемента
        setMenuPosition({ x, y, width, height });
        
        // Определяем, где разместить меню: сверху или снизу
        const screenHeight = Dimensions.get('window').height;
        const spaceBelow = screenHeight - (y + height);
        const spaceAbove = y;
        
        // Если явно указана позиция, используем её
        if (actionMenuPosition !== 'auto') {
          setMenuPlacement(actionMenuPosition);
        } else {
          // Иначе автоматически определяем
          setMenuPlacement(spaceBelow >= 150 || spaceBelow > spaceAbove ? 'bottom' : 'top');
        }
        
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
          })
        ]).start();
      });
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const closeMenu = () => {
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
      })
    ]).start(() => {
      setModalVisible(false);
      // Сбрасываем значения анимации
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    });
  };

  const handleActionPress = (action: ActionItem) => {
    closeMenu();
    action.onPress();
  };

  const renderActionMenu = () => {
    if (!modalVisible) return null;

    // Рассчитываем позицию меню
    const menuStyle: ViewStyle = {
      ...styles.menuContainer,
      backgroundColor,
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }],
    };

    if (menuPlacement === 'bottom') {
      menuStyle.top = menuPosition.y + menuPosition.height + 10;
      menuStyle.left = menuPosition.x;
      menuStyle.maxWidth = Math.min(250, Dimensions.get('window').width - menuPosition.x - 10);
    } else {
      menuStyle.bottom = Dimensions.get('window').height - menuPosition.y + 10;
      menuStyle.left = menuPosition.x;
      menuStyle.maxWidth = Math.min(250, Dimensions.get('window').width - menuPosition.x - 10);
    }

    return (
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <Animated.View style={menuStyle}>
              {actions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionItem}
                  onPress={() => handleActionPress(action)}
                  activeOpacity={0.7}
                >
                  {action.icon && (
                    <View style={styles.actionIcon}>{action.icon}</View>
                  )}
                  <ThemedText style={styles.actionLabel}>{action.label}</ThemedText>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <>
      <Pressable
        ref={elementRef}
        onLongPress={handleLongPress}
        onPress={handlePress}
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
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionLabel: {
    fontSize: 14,
  },
}); 