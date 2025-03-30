import React, { useState, useRef } from 'react';
import { 
  Pressable,
  View,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ActionMenu } from './ActionMenu';
import { useAnimation } from './hooks/useAnimation';
import { useDimensions } from './hooks/useDimensions';
import { ActionItem } from './types';

interface LongPressProps {
  children: React.ReactNode;
  actions: ActionItem[];
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  longPressDuration?: number;
  actionMenuPosition?: 'top' | 'bottom' | 'auto';
}

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
  const backgroundColor = useThemeColor({}, 'card');
  const dimensions = useDimensions();
  const { animationValues, animateIn, animateOut } = useAnimation();

  const handleLongPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        .catch(err => {/* Удален console.log */});
    }
    
    setModalVisible(true);
    animateIn();
  };

  const handlePress = () => {
    if (onPress) onPress();
  };

  const handlePressIn = () => {
    if (onPressIn) onPressIn();
  };

  const handlePressOut = () => {
    if (onPressOut) onPressOut();
  };

  const closeMenu = () => {
    animateOut(() => setModalVisible(false));
  };

  const handleActionPress = (action: ActionItem) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        .catch(err => {/* Удален console.log */});
    }
    
    closeMenu();
    action.onPress();
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

      <ActionMenu
        visible={modalVisible}
        actions={actions}
        backgroundColor={backgroundColor}
        onClose={closeMenu}
        onActionPress={handleActionPress}
        animationValues={animationValues}
      />
    </>
  );
}; 