import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useAppNavigation } from '@/modules/navigation';
import { Button } from '@/components/Button';

export function SectorButtons() {
  const { router } = useAppNavigation();
  
  const handleNavigate = (sectorType: string) => {
    console.log(`[Навигация] Нажата кнопка сектора: ${sectorType}`);
    console.log(`[Навигация] Прямой переход на: /add-specimen с параметрами mode=simple, sector=${sectorType}`);
    
    // Прямая навигация на страницу добавления образца (без вложенности в табы)
    try {
      router.push({
        pathname: "/add-specimen", // Прямой путь к странице
        params: { mode: 'simple', sector: sectorType }
      });
    } catch (err) {
      console.error("[Навигация] Ошибка при переходе:", err);
      Alert.alert("Ошибка навигации", "Не удалось перейти на страницу добавления растения");
    }
  };
  
  return (
    <View style={styles.sectorsContainer}>
      <Button
        title="Дендрология"
        onPress={() => handleNavigate('dendrology')}
        style={styles.sectorButton}
        variant="primary"
      />
      <Button
        title="Флора"
        onPress={() => handleNavigate('flora')}
        style={styles.sectorButton}
        variant="primary"
      />
      <Button
        title="Цветоводство"
        onPress={() => handleNavigate('flowers')}
        style={styles.sectorButton}
        variant="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectorsContainer: {
    gap: 16,
    marginTop: 24,
  },
  sectorButton: {
    marginBottom: 8,
  },
}); 