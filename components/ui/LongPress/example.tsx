import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LongPress, ActionItem } from './LongPress';
import { ThemedText } from '@/components/ThemedText';

export const LongPressExample: React.FC = () => {
  // Действия для карточки
  const cardActions: ActionItem[] = [
    {
      id: 'edit',
      label: 'Редактировать',
      icon: <Ionicons name="create-outline" size={20} color="#4299e1" />,
      onPress: () => console.log('Редактировать карточку')
    },
    {
      id: 'delete',
      label: 'Удалить',
      icon: <Ionicons name="trash-outline" size={20} color="#f56565" />,
      onPress: () => console.log('Удалить карточку')
    },
    {
      id: 'info',
      label: 'Информация',
      icon: <Ionicons name="information-circle-outline" size={20} color="#48bb78" />,
      onPress: () => console.log('Информация о карточке')
    }
  ];

  // Действия для изображения
  const imageActions: ActionItem[] = [
    {
      id: 'download',
      label: 'Скачать',
      icon: <Ionicons name="download-outline" size={20} color="#4299e1" />,
      onPress: () => console.log('Скачать изображение')
    },
    {
      id: 'share',
      label: 'Поделиться',
      icon: <Ionicons name="share-outline" size={20} color="#9f7aea" />,
      onPress: () => console.log('Поделиться изображением')
    },
    {
      id: 'favorite',
      label: 'Добавить в избранное',
      icon: <Ionicons name="heart-outline" size={20} color="#f56565" />,
      onPress: () => console.log('Добавить в избранное')
    }
  ];

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Примеры использования LongPress</ThemedText>
      
      <View style={styles.exampleContainer}>
        <ThemedText style={styles.sectionTitle}>1. Долгое нажатие на карточку</ThemedText>
        <LongPress 
          actions={cardActions}
          onPress={() => console.log('Нажатие на карточку')}
        >
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Карточка растения</ThemedText>
            <ThemedText>Нажмите и удерживайте для появления меню</ThemedText>
          </View>
        </LongPress>
      </View>

      <View style={styles.exampleContainer}>
        <ThemedText style={styles.sectionTitle}>2. Долгое нажатие на изображение</ThemedText>
        <LongPress 
          actions={imageActions}
          onPress={() => console.log('Нажатие на изображение')}
          actionMenuPosition="top"
        >
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={48} color="#a0aec0" />
            <ThemedText style={styles.imageText}>Фото растения</ThemedText>
          </View>
        </LongPress>
      </View>

      <View style={styles.exampleContainer}>
        <ThemedText style={styles.sectionTitle}>3. Долгое нажатие на текст</ThemedText>
        <View style={styles.textContainer}>
          <ThemedText>Обычный текст</ThemedText>
          <LongPress 
            actions={[
              {
                id: 'copy',
                label: 'Копировать',
                icon: <Ionicons name="copy-outline" size={20} color="#4299e1" />,
                onPress: () => console.log('Копировать текст')
              }
            ]}
          >
            <ThemedText style={styles.specialText}>
              Это специальный текст с долгим нажатием
            </ThemedText>
          </LongPress>
          <ThemedText>Обычный текст продолжается...</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  exampleContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    marginTop: 8,
    fontSize: 14,
  },
  textContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
  },
  specialText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4299e1',
    padding: 8,
    marginVertical: 8,
    backgroundColor: '#ebf8ff',
    borderRadius: 4,
  },
}); 