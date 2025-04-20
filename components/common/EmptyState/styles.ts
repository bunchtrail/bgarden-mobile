import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16, 
    color: '#666', // Используем цвет из SpecimenGallery
    textAlign: 'center',
    marginBottom: 20, // Используем отступ из CatalogScreen
  },
}); 