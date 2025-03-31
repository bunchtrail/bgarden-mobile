import { StyleSheet, Platform, Dimensions, StatusBar, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

// Определение размеров экрана и адаптивных параметров
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width > 768;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;

// Адаптивный масштаб для различных размеров экранов
const scale = Math.min(1, width / 390);
const INPUT_HEIGHT = Math.max(44, 48 * scale);
const BORDER_RADIUS = 12 * scale;
const PADDING = 16 * scale;

// Интерфейс для типа hitSlop
interface BackButtonStyle extends ViewStyle {
  hitSlop?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Адаптивный паддинг для разных устройств
    paddingTop: Platform.OS === 'ios' 
      ? (isSmallDevice ? 30 : 40)
      : 10 + STATUS_BAR_HEIGHT,
    paddingHorizontal: PADDING,
    position: 'relative',
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingBottom: 10 * scale,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowColor: '#000',
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    flex: 1,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  backButton: {
    padding: 10,
    marginRight: 5,
    position: 'absolute',
    left: PADDING,
    // Адаптивное позиционирование для разных устройств
    top: (Platform.OS === 'ios' ? (isSmallDevice ? 30 : 50) : 10 + STATUS_BAR_HEIGHT),
    zIndex: 1,
    // hitSlop добавляется программно
  } as BackButtonStyle,
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: PADDING,
    paddingBottom: 30 * scale,
    ...(isTablet && {
      maxWidth: 600,
      alignSelf: 'center',
      width: '100%',
    }),
  },
  sectionContainer: {
    marginBottom: 24 * scale,
    backgroundColor: Colors.light.card,
    borderRadius: BORDER_RADIUS,
    padding: PADDING,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowColor: '#000',
      },
      android: {
        elevation: 1,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18 * scale,
    fontWeight: 'bold',
    marginBottom: 12 * scale,
    color: Colors.light.text,
  },
  checkboxContainer: {
    marginVertical: 10 * scale,
  },
  buttonsContainer: {
    // Изменение направления на маленьких экранах
    flexDirection: isSmallDevice ? 'column' : 'row',
    justifyContent: 'space-between',
    marginTop: 24 * scale,
  },
  button: {
    flex: isSmallDevice ? undefined : 1,
    marginHorizontal: isSmallDevice ? 0 : 5 * scale,
    marginBottom: isSmallDevice ? 10 * scale : 0,
    width: isSmallDevice ? '100%' : undefined,
    borderRadius: BORDER_RADIUS,
    height: INPUT_HEIGHT,
  },
  selectorContainer: {
    marginVertical: 10 * scale,
  },
  label: {
    fontSize: 16 * scale,
    marginBottom: 8 * scale,
    color: Colors.light.text,
    fontWeight: '500',
  },
  sectorButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // Перенос кнопок на маленьких экранах
    flexWrap: isSmallDevice ? 'wrap' : 'nowrap',
  },
  sectorButton: {
    flex: isSmallDevice ? undefined : 1,
    width: isSmallDevice ? '48%' : undefined,
    paddingVertical: 10 * scale,
    paddingHorizontal: 16 * scale,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BORDER_RADIUS - 4,
    marginHorizontal: 4 * scale,
    marginBottom: isSmallDevice ? 8 * scale : 0,
    alignItems: 'center',
  },
  sectorButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  sectorButtonText: {
    color: Colors.light.text,
    fontSize: 14 * scale,
    textAlign: 'center',
  },
  sectorButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 8 * scale,
  },
  fieldContainer: {
    marginBottom: 20 * scale,
  },
  fieldLabel: {
    fontSize: 16 * scale,
    fontWeight: '600',
    marginBottom: 8 * scale,
    color: Colors.light.text,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BORDER_RADIUS,
    padding: 14 * scale,
    fontSize: 16 * scale,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
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
  errorInput: {
    borderColor: '#e53935',
  },
  errorText: {
    color: '#e53935',
    fontSize: 14 * scale,
    marginTop: 4 * scale,
    fontWeight: '500',
  },
  locationHeader: {
    // Адаптивное направление для разных экранов
    flexDirection: isSmallDevice ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isSmallDevice ? 'flex-start' : 'center',
    marginBottom: 10 * scale,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.light.primary}15`,
    paddingHorizontal: 12 * scale,
    paddingVertical: 8 * scale,
    borderRadius: BORDER_RADIUS - 4,
    // Полная ширина на маленьких экранах
    width: isSmallDevice ? '100%' : undefined,
    justifyContent: isSmallDevice ? 'center' : undefined,
    marginTop: isSmallDevice ? 8 * scale : 0,
  },
  locationButtonText: {
    fontSize: 14 * scale,
    fontWeight: '600',
    color: Colors.light.primary,
    marginLeft: 8 * scale,
  },
  coordinatesContainer: {
    // Вертикальное расположение на маленьких экранах
    flexDirection: isSmallDevice ? 'column' : 'row',
    backgroundColor: Colors.light.card,
    borderRadius: BORDER_RADIUS,
    padding: PADDING,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  coordinateField: {
    flex: 1,
    marginRight: isSmallDevice ? 0 : 8 * scale,
    marginBottom: isSmallDevice ? 10 * scale : 0,
  },
  coordinateLabel: {
    fontSize: 13 * scale,
    color: '#666',
    marginBottom: 6 * scale,
    fontWeight: '500',
  },
  coordinateValue: {
    fontSize: 16 * scale,
    fontWeight: '600',
    color: Colors.light.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  leftIcon: {
    position: 'absolute',
    left: 14 * scale,
    zIndex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  inputWithIcon: {
    paddingLeft: 44 * scale,
  },
  multilineInput: {
    height: 100 * scale,
    textAlignVertical: 'top',
    paddingTop: 14 * scale,
  },
  // Стили для модальных окон
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalList: {
    width: '100%',
  },
  modalListContent: {
    paddingBottom: 16,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalItemDescription: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    padding: 16,
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholderText: {
    color: '#9E9E9E',
  },
  
  // Стили для выпадающего списка в стиле Apple
  appleDropdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 240,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  dropdownList: {
    width: '100%',
    maxHeight: 240,
  },
  dropdownListContent: {
    paddingVertical: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemContent: {
    flex: 1,
    marginRight: 8,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dropdownItemDescription: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  dropdownSeparator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginHorizontal: 8,
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: -1,
  },
});

// Функция для получения стилей при смене ориентации экрана
export const getOrientationStyles = (isLandscape: boolean) => {
  if (isLandscape && !isSmallDevice) {
    return StyleSheet.create({
      scrollContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      },
      sectionContainer: {
        width: '48%',
      }
    });
  }
  return {};
};

