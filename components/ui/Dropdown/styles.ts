import { StyleSheet, Platform, Dimensions, StatusBar, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

// Определение размеров экрана и адаптивных параметров
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const scale = Math.min(1, width / 390);
const INPUT_HEIGHT = Math.max(44, 48 * scale);
const BORDER_RADIUS = 12 * scale;
const PADDING = 16 * scale;

// Стили скопированы из app/add-specimen/styles.ts и адаптированы
export const dropdownStyles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20 * scale,
  },
  fieldLabel: {
    fontSize: 16 * scale,
    fontWeight: '600',
    marginBottom: 8 * scale,
    color: Colors.light.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 14 * scale,
    backgroundColor: Colors.light.background,
    height: INPUT_HEIGHT,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  dropdownInput: {
    justifyContent: 'space-between',
  },
  leftIcon: {
    marginRight: 10 * scale,
  },
  textInput: {
    flex: 1,
    fontSize: 16 * scale,
    color: Colors.light.text,
  },
  placeholderText: {
    color: '#999',
  },
  errorInput: {
    borderColor: '#e53935',
  },
  errorText: {
    color: '#e53935',
    fontSize: 14 * scale,
    marginTop: 4 * scale,
    fontWeight: '500',
  },
  appleDropdown: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden', // Обрезает содержимое по границам
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  dropdownList: {
    maxHeight: height * 0.3, // Ограничение высоты списка
  },
  dropdownListContent: {
    paddingVertical: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  dropdownItemContent: {
    flex: 1,
    marginRight: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemDescription: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  dropdownSeparator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16, // Отступы для разделителя
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#888',
    padding: 16,
  },
}); 