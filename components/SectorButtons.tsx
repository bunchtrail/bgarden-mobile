import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useAppNavigation } from '@/modules/navigation';
import { Button } from '@/components/Button';

export function SectorButtons() {
  const { router } = useAppNavigation();
  
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
        pathname: "/add-specimen/AddSpecimenScreen", // Прямой путь к странице
        params: params
      });
    } catch (err) {
      // console.error("[Навигация] Ошибка при переходе:", err);
      Alert.alert("Ошибка навигации", "Не удалось перейти на страницу добавления растения");
    }
  };
  
  return (
    // Используем `flexDirection: 'row'` и `flexWrap: 'wrap'` для сетки
    <View style={styles.sectorsContainer}>
      <View style={styles.buttonWrapper}> 
        <Button
          title="Дендрология"
          onPress={() => handleNavigate('dendrology')}
          style={styles.sectorButton}
          variant="primary"
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          title="Флора"
          onPress={() => handleNavigate('flora')}
          style={styles.sectorButton}
          variant="primary"
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          title="Цветоводство"
          onPress={() => handleNavigate('flowers')}
          style={styles.sectorButton}
          variant="primary"
        />
      </View>
      {/* Добавьте сюда другие кнопки секторов при необходимости */}
    </View>
  );
}

const styles = StyleSheet.create({
  sectorsContainer: {
    flexDirection: 'row', // Располагаем кнопки в ряд
    flexWrap: 'wrap', // Переносим на следующую строку, если не влезают
    justifyContent: 'space-between', // Распределяем пространство между колонками
    gap: 16, // Пространство между рядами и колонками (вертикальное и горизонтальное)
    // Убираем marginTop, так как он теперь управляется из HomePage
    // marginTop: 24, 
  },
  // Добавляем обертку для каждой кнопки, чтобы задать ширину
  buttonWrapper: {
    width: '48%', // Примерно половина ширины с учетом gap
  },
  sectorButton: {
    // Убираем marginBottom, gap в контейнере теперь отвечает за отступы
    // marginBottom: 8,
    width: '100%', // Кнопка занимает всю ширину обертки
  },
}); 