import React from 'react';
import { 
  View, StyleSheet, Modal, TouchableOpacity, 
  TouchableWithoutFeedback, Animated
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ActionItem } from './types';

interface ActionMenuProps {
  visible: boolean;
  actions: ActionItem[];
  backgroundColor: string;
  onClose: () => void;
  onActionPress: (action: ActionItem) => void;
  animationValues: {
    opacity: Animated.Value;
    scale: Animated.Value;
    slide: Animated.Value;
  };
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  visible,
  actions,
  backgroundColor,
  onClose,
  onActionPress,
  animationValues
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape']}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.touchableArea} />
        </TouchableWithoutFeedback>
        
        <Animated.View 
          style={[
            styles.bottomMenuWrapper, 
            {
              opacity: animationValues.opacity,
              transform: [
                { scale: animationValues.scale },
                { translateY: animationValues.slide }
              ],
            }
          ]}
        >
          <View 
            style={[styles.bottomMenuContainer, { backgroundColor }]}
          >
            {actions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionItem}
                onPress={() => onActionPress(action)}
                activeOpacity={0.7}
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