import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserRole } from '@/types';

interface PlantCardActionsProps {
  userRole: UserRole;
}

const PlantCardActions: React.FC<PlantCardActionsProps> = ({ userRole }) => {
  if (userRole === UserRole.Administrator) {
    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={24} color="white" />
          <Text style={styles.actionText}>Изменить</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash-outline" size={24} color="white" />
          <Text style={styles.actionText}>Удалить</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="ruler" size={24} color="white" />
          <Text style={styles.actionText}>Биометрия</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="flower" size={24} color="white" />
          <Text style={styles.actionText}>Фенология</Text>
        </TouchableOpacity>
      </View>
    );
  } 
  
  if (userRole === UserRole.Employee) {
    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={24} color="white" />
          <Text style={styles.actionText}>Изменить</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="ruler" size={24} color="white" />
          <Text style={styles.actionText}>Биометрия</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="flower" size={24} color="white" />
          <Text style={styles.actionText}>Фенология</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="share-outline" size={24} color="white" />
        <Text style={styles.actionText}>Поделиться</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="bookmark-outline" size={24} color="white" />
        <Text style={styles.actionText}>Сохранить</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="location-outline" size={24} color="white" />
        <Text style={styles.actionText}>На карте</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});

export default PlantCardActions; 