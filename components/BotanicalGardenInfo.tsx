import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export function BotanicalGardenInfo() {
  return (
    <ThemedView style={styles.infoContainer}>
      <ThemedText type="subtitle" style={styles.infoTitle}>
        О Ботаническом саде ВятГУ
      </ThemedText>
      <ThemedText style={styles.infoText}>
        Ботанический сад Вятского государственного университета - уникальная коллекция растений 
        местной и иностранной флоры. Основан в рамках научно-исследовательской деятельности 
        университета и служит образовательным целям.
      </ThemedText>

      <View style={styles.contactBlock}>
        <ThemedText style={styles.contactTitle}>
          Часы работы
        </ThemedText>
        <ThemedText style={styles.contactText}>
          Пн-Пт: 9:00 - 17:00{'\n'}
          Сб: 10:00 - 16:00{'\n'}
          Вс: выходной
        </ThemedText>
      </View>

      <View style={styles.contactBlock}>
        <ThemedText style={styles.contactTitle}>
          Контакты
        </ThemedText>
        <ThemedText style={styles.contactText}>
          Адрес: г. Киров, ул. Ленина, 198{'\n'}
          Телефон: +7 (8332) 123-45-67{'\n'}
          Email: garden@vyatsu.ru
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    marginBottom: 16,
    lineHeight: 22,
  },
  contactBlock: {
    marginTop: 16,
  },
  contactTitle: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600'
  },
  contactText: {
    lineHeight: 22,
  },
}); 