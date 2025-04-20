import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useAppNavigation } from '@/modules/navigation';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/IconSymbol.ios';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export function SectorButtons() {
  const { router } = useAppNavigation();
  const iconColor = useThemeColor({}, 'icon');
  
  const handleNavigate = (sectorType: string) => {
    // console.log(`[Навигация] Нажата кнопка сектора: ${sectorType}`);
    // console.log(`[Навигация] Прямой переход на: /add-specimen с параметрами mode=simple, sector=${sectorType}`);
    
    // Прямая навигация на страницу добавления образца (без вложенности в табы)
    try {
      // Убедимся, что значение sector передается правильно
      const params = { 
        mode: 'simple', 
        sector: sectorType // Явно определяем параметр sector
      };
      // console.log(`[Навигация] Передаваемые параметры:`, params);
      
      router.push({
        pathname: "/(add-specimen)", // Прямой путь к странице с группой маршрутов
        params: params
      });
    } catch (err) {
      // console.error("[Навигация] Ошибка при переходе:", err);
      Alert.alert("Ошибка навигации", "Не удалось перейти на страницу добавления растения");
    }
  };
  
  // Структура данных для кнопок-карточек
  const sectors = [
    // Возвращаем поле icon
    { name: 'Дендрология', type: 'dendrology', icon: 'tree.fill' as any }, 
    { name: 'Флора', type: 'flora', icon: 'leaf' as any }, 
    { name: 'Цветоводство', type: 'flowers', icon: 'flower' as any }
    // Добавьте сюда другие секторы при необходимости
  ];
  
  return (
    // Используем `flexDirection: 'row'` и `flexWrap: 'wrap'` для сетки
    <View style={styles.sectorsContainer}>
      {sectors.map((sector) => (
        // Обертка для каждой карточки (задает ширину)
        <View key={sector.type} style={styles.cardWrapper}> 
          <Card 
            onPress={() => handleNavigate(sector.type)}
            style={styles.cardContent} // Убираем внутренний padding по умолчанию, чтобы управлять контентом
            variant="elevated" // Используем вариант с тенью для лучшего выделения
          >
            <View style={styles.innerContent}>
              {/* Убираем placeholder */}
              {/* <View style={styles.iconPlaceholder}>
                <ThemedText style={styles.iconPlaceholderText}>
                  {sector.name.charAt(0)}
                </ThemedText>
              </View> */}
              {/* Раскомментируем IconSymbol */}
              <IconSymbol 
                name={sector.icon} // Теперь используем правильные имена
                size={32} 
                color={iconColor} 
                style={styles.icon} // Используем правильное имя стиля
              /> 
              <ThemedText style={styles.cardText}>{sector.name}</ThemedText>
            </View>
          </Card>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectorsContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    // justifyContent: 'space-between', // Убрано для одной колонки
    gap: 16,
  },
  cardWrapper: {
    width: '100%',
  },
  cardContent: {
    padding: 0, 
    marginVertical: 0, 
  },
  innerContent: {
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 20, 
    paddingHorizontal: 10, 
    minHeight: 100, 
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, 
  },
  iconPlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  cardText: {
    textAlign: 'center', 
    fontSize: 14, 
  },
  icon: {
    marginBottom: 8,
  },
}); 