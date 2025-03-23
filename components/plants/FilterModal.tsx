import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SectorType } from '@/types';

interface ModalItem {
  id: number | SectorType;
  name: string;
  [key: string]: string | number | SectorType;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (id: number | SectorType) => void;
  title: string;
  items: ModalItem[];
  activeItemId?: number | SectorType;
}

const FilterModal: React.FC<FilterModalProps> = ({ 
  visible, 
  onClose, 
  onSelect, 
  title, 
  items, 
  activeItemId 
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isSelected = item.id === activeItemId;
            return (
              <TouchableOpacity
                style={[styles.modalItem, isSelected && styles.selectedModalItem]}
                onPress={() => onSelect(item.id)}
              >
                <Text style={[styles.modalItemText, isSelected && styles.selectedModalItemText]}>
                  {item.name}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={20} color="#4CAF50" />
                )}
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalList}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  modalList: {
    paddingBottom: 30,
  },
  modalItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedModalItem: {
    backgroundColor: '#F9FFF9',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedModalItemText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default FilterModal; 