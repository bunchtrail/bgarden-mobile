import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Specimen, UserRole, SectorType } from '@/types';
import { mockSpecimens } from '@/data/mockData';

export default function PlantDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [plant, setPlant] = useState<Specimen | null>(null);
  const [loading, setLoading] = useState(true);
  const userRole: number = UserRole.Client; // В будущем получать из контекста авторизации
  
  useEffect(() => {
    loadPlantDetails();
  }, [id]);
  
  const loadPlantDetails = async () => {
    setLoading(true);
    
    try {
      // TODO: Заменить на API запрос
      // const response = await fetch(`https://api.example.com/specimens/${id}`);
      // const data = await response.json();
      // setPlant(data);
      
      // Временное решение с использованием моковых данных
      setTimeout(() => {
        const plantId = typeof id === 'string' ? parseInt(id, 10) : Array.isArray(id) ? parseInt(id[0], 10) : 0;
        const specimen = mockSpecimens.find(s => s.id === plantId);
        setPlant(specimen || null);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Ошибка при загрузке данных о растении:', error);
      setLoading(false);
    }
  };
  
  const getSectorTypeName = (type: number): string => {
    switch (type) {
      case SectorType.Dendrology:
        return 'Дендрология';
      case SectorType.Flora:
        return 'Флора';
      case SectorType.Flowering:
        return 'Цветение';
      default:
        return 'Неизвестно';
    }
  };
  
  // Доступные действия в зависимости от роли пользователя
  const renderActions = () => {
    if (!plant) return null;
    
    if (userRole === 1) { // UserRole.Administrator
      return (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Изменить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="trash-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Удалить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="ruler" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Биометрия</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="flower" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Фенология</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (userRole === 2) { // UserRole.Employee
      return (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Изменить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="ruler" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Биометрия</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="flower" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Фенология</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Поделиться</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Сохранить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="location-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>На карте</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </ThemedView>
    );
  }
  
  if (!plant) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText style={styles.errorText}>Растение не найдено</ThemedText>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText>Вернуться назад</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: plant.russianName,
          headerShown: true,
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: plant.illustration || 'https://via.placeholder.com/400x300.png?text=Plant+Image' }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.detailsContainer}>
          <ThemedText style={styles.russianName}>{plant.russianName}</ThemedText>
          <ThemedText style={styles.latinName}>{plant.latinName}</ThemedText>
          
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Основная информация</ThemedText>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Семейство:</ThemedText>
              <ThemedText style={styles.detailValue}>{plant.familyName}</ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Род / Вид:</ThemedText>
              <ThemedText style={styles.detailValue}>{plant.genus} {plant.species}</ThemedText>
            </View>
            
            {plant.cultivar && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Сорт:</ThemedText>
                <ThemedText style={styles.detailValue}>{plant.cultivar}</ThemedText>
              </View>
            )}
            
            {plant.form && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Форма:</ThemedText>
                <ThemedText style={styles.detailValue}>{plant.form}</ThemedText>
              </View>
            )}
            
            {plant.synonyms && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Синонимы:</ThemedText>
                <ThemedText style={styles.detailValue}>{plant.synonyms}</ThemedText>
              </View>
            )}
            
            {plant.determinedBy && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Определил:</ThemedText>
                <ThemedText style={styles.detailValue}>{plant.determinedBy}</ThemedText>
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Расположение и происхождение</ThemedText>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Инв. номер:</ThemedText>
              <ThemedText style={styles.detailValue}>{plant.inventoryNumber}</ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Сектор:</ThemedText>
              <ThemedText style={styles.detailValue}>{getSectorTypeName(plant.sectorType)}</ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Экспозиция:</ThemedText>
              <ThemedText style={styles.detailValue}>{plant.expositionName}</ThemedText>
            </View>
            
            {plant.regionName && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Регион:</ThemedText>
                <ThemedText style={styles.detailValue}>{plant.regionName}</ThemedText>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Год посадки:</ThemedText>
              <ThemedText style={styles.detailValue}>{plant.plantingYear}</ThemedText>
            </View>
            
            {plant.originalYear && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Год выведения:</ThemedText>
                <ThemedText style={styles.detailValue}>{plant.originalYear}</ThemedText>
              </View>
            )}
            
            {plant.originalBreeder && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Селекционер:</ThemedText>
                <ThemedText style={styles.detailValue}>{plant.originalBreeder}</ThemedText>
              </View>
            )}
            
            {plant.naturalRange && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Ареал:</ThemedText>
                <ThemedText style={styles.detailValue}>{plant.naturalRange}</ThemedText>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Гербарий:</ThemedText>
              <ThemedText style={styles.detailValue}>{plant.hasHerbarium ? 'Имеется' : 'Отсутствует'}</ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Координаты:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {plant.latitude.toFixed(4)}, {plant.longitude.toFixed(4)}
              </ThemedText>
            </View>
          </View>
          
          {plant.description && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Описание</ThemedText>
              <ThemedText style={styles.description}>{plant.description}</ThemedText>
            </View>
          )}
          
          {renderActions()}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 300,
  },
  detailsContainer: {
    padding: 16,
  },
  russianName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  latinName: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    flex: 1,
    fontWeight: 'bold',
  },
  detailValue: {
    flex: 2,
  },
  description: {
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    color: '#333',
  },
}); 