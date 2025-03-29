import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Specimen, UserRole, SectorType } from '@/types';
import { plantsApi } from '@/modules/plants/services';
import { useSpecimenImage } from '@/modules/plants/hooks';

// --- ФУНКЦИЯ ПРЕОБРАЗОВАНИЯ ТИПА СЕКТОРА ---
// Вынесена за пределы компонента для чистоты
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

// --- КОМПОНЕНТ ДЛЯ ОТОБРАЖЕНИЯ СТРОКИ ДЕТАЛЕЙ ---
// Вынесен для улучшения читаемости и переиспользования
interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => {
  // Не рендерим строку, если значение отсутствует (null, undefined, пустая строка)
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return (
    <View style={styles.detailRow}>
      <ThemedText style={styles.detailLabel}>{label}:</ThemedText>
      {/* Убеждаемся, что значение всегда строка перед рендерингом */}
      <ThemedText style={styles.detailValue}>{String(value)}</ThemedText>
    </View>
  );
};

export default function PlantDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [plant, setPlant] = useState<Specimen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Состояние для ошибки

  // Получаем ID растения для использования с хуком изображений
  const plantId = typeof id === 'string' ? parseInt(id, 10) : Array.isArray(id) ? parseInt(id[0], 10) : 0;
  
  // Используем тот же хук для загрузки изображений, что и в PlantCard
  const { imageSrc, isLoading: imageLoading } = useSpecimenImage(plantId);

  // TODO: Заменить на получение реальной роли пользователя из контекста авторизации
  const userRole: UserRole = UserRole.Client;

  useEffect(() => {
    loadPlantDetails();
  }, [id]); // Зависимость только от id

  const loadPlantDetails = async () => {
    setLoading(true);
    setError(null); // Сбрасываем ошибку перед загрузкой

    // Проверка и преобразование ID
    if (isNaN(plantId) || plantId <= 0) {
        setError('Неверный ID растения.');
        setLoading(false);
        setPlant(null); // Убедимся, что состояние plant сброшено
        return;
    }

    try {
      const response = await plantsApi.getSpecimenById(plantId);

      if (response.error) {
        setError(`Не удалось загрузить данные о растении. ${response.error}`);
        setPlant(null);
      } else if (response.data) {
        setPlant(response.data);
      } else {
        // Эта ситуация маловероятна при status 200, но обрабатываем на всякий случай
        setError('Данные о растении не найдены.');
        setPlant(null);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная сетевая ошибка или ошибка обработки данных.';
      setError(`Произошла ошибка: ${errorMessage}`);
      setPlant(null);
    } finally {
      setLoading(false);
    }
  };

  // --- РЕНДЕРИНГ ДЕЙСТВИЙ ---
  const renderActions = () => {
    // Действия не рендерятся если нет данных о растении
    if (!plant) return <></>;

    const role = Number(userRole); // Приводим к числу для надежного сравнения

    // Общие стили для кнопок действий
    const commonButtonProps = {
        style: styles.actionButton,
        activeOpacity: 0.7, // Добавляем визуальный отклик при нажатии
    };
    const commonIconProps = {
        size: 24,
        color: "#4CAF50", // Цвет иконки
    };

    // Если роль не определена или неизвестна
    return <></>;
  };


  // --- СОСТОЯНИЯ ЗАГРУЗКИ И ОШИБКИ ---
  if (loading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <ThemedText style={{ marginTop: 10 }}>Загрузка данных...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.errorText}>Ошибка</ThemedText>
        <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>{error}</ThemedText>
        <TouchableOpacity style={styles.backButton} onPress={loadPlantDetails}>
          <ThemedText style={{ color: 'white' }}>Попробовать снова</ThemedText>
        </TouchableOpacity>
         <TouchableOpacity style={[styles.backButton, {marginTop: 10, backgroundColor: '#aaa'}]} onPress={() => router.back()}>
          <ThemedText style={{ color: 'white' }}>Вернуться назад</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // Если загрузка завершена, ошибки нет, но растение не найдено
  if (!plant) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.errorText}>Растение не найдено</ThemedText>
         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={{ color: 'white' }}>Вернуться назад</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // --- ПОДГОТОВКА ДАННЫХ ДЛЯ ОТОБРАЖЕНИЯ ---
  // Безопасное получение значений для растения
  const russianName = plant.russianName || 'Без русского названия';
  const latinName = plant.latinName || (plant.genus && plant.species ? `${plant.genus} ${plant.species}` : 'Без латинского названия');
  const familyName = plant.family?.name || 'Семейство не указано'; // Используем данные из вложенного объекта family
  const expositionName = plant.exposition?.name || 'Экспозиция не указана'; // Используем данные из вложенного объекта exposition
  const regionName = plant.region?.name || 'Регион не указан'; // Используем данные из вложенного объекта region
  const hasHerbariumText = plant.hasHerbarium ? 'Имеется' : 'Отсутствует';

  // Получаем URL изображения из хука useSpecimenImage или используем запасные варианты
  const imageUrl = imageSrc || plant.mainImage || plant.illustration || 'https://via.placeholder.com/400x300.png?text=Нет+изображения';
  
  // Логируем информацию об изображениях (только в режиме разработки)
  if (__DEV__) {

  }

  // Форматирование координат
  const formatCoordinate = (coord: number | null | undefined): string => {
    return typeof coord === 'number' ? coord.toFixed(4) : 'N/A';
  };
  const coordinatesText = `${formatCoordinate(plant.latitude)}, ${formatCoordinate(plant.longitude)}`;

  // Форматирование координат на карте
  const formatMapCoordinate = (coord: number | null | undefined): string => {
    return typeof coord === 'number' ? coord.toFixed(2) : 'N/A';
  };
  const mapCoordinatesText = `${formatMapCoordinate(plant.mapX)}, ${formatMapCoordinate(plant.mapY)}`;



  // --- ОСНОВНОЙ РЕНДЕРИНГ КОМПОНЕНТА ---
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: russianName, // Используем подготовленное имя
          headerShown: true,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Изображение */}
        <View style={styles.imageContainer}>
          {imageLoading ? (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <ThemedText style={{ marginTop: 10 }}>Загрузка изображения...</ThemedText>
            </View>
          ) : !imageUrl || imageUrl === 'https://via.placeholder.com/400x300.png?text=Нет+изображения' ? (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="image-outline" size={64} color="#999" />
              <ThemedText style={{ marginTop: 10, color: '#999' }}>Изображение отсутствует</ThemedText>
            </View>
          ) : (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
              // Полная обработка ошибок загрузки изображения
              onError={(e) => {
                // Можно добавить обработку ошибки здесь, если нужно
                console.error("Ошибка загрузки изображения:", e.nativeEvent);
              }}
            />
          )}
        </View>

        <View style={styles.detailsContainer}>
          {/* Названия */}
          <ThemedText style={styles.russianName}>{russianName}</ThemedText>
          <ThemedText style={styles.latinName}>{latinName}</ThemedText>

          {/* Секция: Основная информация           */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Основная информация</ThemedText>
            <DetailRow label="Семейство" value={familyName} />
            {(plant.genus || plant.species) ? (
              <DetailRow label="Род / Вид" value={`${plant.genus || ''} ${plant.species || ''}`.trim()} />
            ) : null}
            <DetailRow label="Сорт" value={plant.cultivar} />
            <DetailRow label="Форма" value={plant.form} />
            <DetailRow label="Синонимы" value={plant.synonyms} />
            <DetailRow label="Определил" value={plant.determinedBy} />
          </View>




          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Расположение и происхождение</ThemedText>
            <DetailRow label="Инв. номер" value={plant.inventoryNumber} />
            <DetailRow label="Сектор" value={getSectorTypeName(plant.sectorType)} />
            <DetailRow label="Экспозиция" value={expositionName} />
            <DetailRow label="Регион" value={regionName} />
            <DetailRow label="Год посадки" value={plant.plantingYear} />
            <DetailRow label="Год выведения" value={plant.originalYear !== 0 ? plant.originalYear : null} />
            <DetailRow label="Селекционер" value={plant.originalBreeder} />
            <DetailRow label="Естеств. ареал" value={plant.naturalRange} />
            <DetailRow label="Гербарий" value={hasHerbariumText} />
            
            {(plant.latitude !== null || plant.longitude !== null) && (
                <DetailRow label="Координаты (lat, lon)" value={coordinatesText} />
            )}
             
            {(plant.mapX !== null || plant.mapY !== null) && (
                <DetailRow label="На карте (X, Y)" value={mapCoordinatesText} />
            )}
             <DetailRow label="Происхождение образца" value={plant.sampleOrigin}/>
             <DetailRow label="Страна происхождения" value={plant.country}/>
             <DetailRow label="Дублеты" value={plant.duplicatesInfo}/>
             <DetailRow label="Кем заполнено" value={plant.filledBy}/>


          </View> 

           {/* Секция: Дополнительная информация */}
           {(plant.ecologyAndBiology || plant.economicUse || plant.conservationStatus) ? (
             <View style={styles.section}>
               <ThemedText style={styles.sectionTitle}>Дополнительная информация</ThemedText>
               <DetailRow label="Экология и биология" value={plant.ecologyAndBiology} />
               <DetailRow label="Хозяйственное использование" value={plant.economicUse} />
               <DetailRow label="Статус сохранности" value={plant.conservationStatus} />
             </View>
           ) : null}


          {/* Секция: Описание (Заметки) */}
          {plant.notes ? (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Описание</ThemedText>
              {/* Используем String() для безопасности, хотя notes должно быть строкой */}
              <ThemedText style={styles.description}>{String(plant.notes)}</ThemedText>
            </View>
          ) : null}

          {/* Рендеринг действий */}
          {renderActions()}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

// --- СТИЛИ ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Явный фон для контейнера
  },
  centeredContainer: { // Переименовано для ясности
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Добавлены отступы
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 20, // Увеличен размер
    fontWeight: 'bold', // Выделение жирным
    color: '#d32f2f', // Красный цвет для ошибки
    marginBottom: 10, // Отступ снизу
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 10, // Вертикальный отступ
    paddingHorizontal: 20, // Горизонтальный отступ
    backgroundColor: '#4CAF50', // Цвет фона кнопки
    borderRadius: 8, // Скругление углов
    marginTop: 15, // Отступ сверху
    elevation: 2, // Тень для Android
    shadowColor: '#000', // Тень для iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0', // Цвет фона для случая, если изображение не загрузится
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  detailsContainer: {
    padding: 16,
  },
  russianName: {
    fontSize: 26, // Немного увеличен
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333', // Цвет текста
  },
  latinName: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 20, // Увеличен отступ
    color: '#555', // Цвет текста
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20, // Увеличен размер
    fontWeight: '600', // Полужирный
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Цвет разделителя
    paddingBottom: 8,
    color: '#444', // Цвет текста заголовка секции
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Равномерное распределение
    marginBottom: 10, // Увеличен отступ
    paddingVertical: 4, // Небольшой вертикальный отступ внутри строки
  },
  detailLabel: {
    flex: 0.45, // Немного больше места для метки
    fontWeight: '600', // Полужирный
    color: '#333', // Цвет текста метки
    marginRight: 8, // Отступ справа от метки
  },
  detailValue: {
    flex: 0.55, // Немного меньше места для значения
    color: '#555', // Цвет текста значения
    textAlign: 'left', // Выравнивание по левому краю для значения
  },
  description: {
    lineHeight: 22,
    color: '#555', // Цвет текста описания
    fontSize: 16, // Увеличен размер шрифта описания
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    marginBottom: 16,
    paddingTop: 16, // Добавлен отступ сверху
    borderTopWidth: 1, // Разделитель сверху
    borderTopColor: '#e0e0e0',
    flexWrap: 'wrap', // Разрешен перенос кнопок
  },
  actionButton: {
    alignItems: 'center',
    padding: 10, // Добавлен внутренний отступ для области нажатия
    minWidth: 80, // Минимальная ширина для кнопок
    marginBottom: 10, // Отступ снизу для переноса
  },
  actionText: {
    marginTop: 6, // Увеличен отступ
    fontSize: 12,
    color: '#333', // Цвет текста кнопки
    textAlign: 'center', // Центрирование текста
  },
}); 