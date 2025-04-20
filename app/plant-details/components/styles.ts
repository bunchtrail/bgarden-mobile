import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
  imageContainer: { // Используется в PlantDetails для обертки карусели
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0', // Цвет фона для случая, если изображение не загрузится
  },
  image: { // Используется в ImageCarousel
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: { // Используется в ImageCarousel и PlantDetails (при загрузке)
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  detailsContainer: { // Используется в PlantDetails для контента под галереей
    padding: 16,
  },
  russianName: { // Используется в PlantBasicInfo
    fontSize: 26, // Немного увеличен
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333', // Цвет текста
  },
  latinName: { // Используется в PlantBasicInfo
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 20, // Увеличен отступ
    color: '#555', // Цвет текста
  },
  section: { // Используется в PlantBasicInfo, PlantLocation, PlantAdditionalInfo
    marginBottom: 24,
  },
  sectionTitle: { // Используется в PlantBasicInfo, PlantLocation, PlantAdditionalInfo
    fontSize: 20, // Увеличен размер
    fontWeight: '600', // Полужирный
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Цвет разделителя
    paddingBottom: 8,
    color: '#444', // Цвет текста заголовка секции
  },
  detailRow: { // Используется в DetailRow
    flexDirection: 'row',
    justifyContent: 'space-between', // Равномерное распределение
    marginBottom: 10, // Увеличен отступ
    paddingVertical: 4, // Небольшой вертикальный отступ внутри строки
  },
  detailLabel: { // Используется в DetailRow
    flex: 0.45, // Немного больше места для метки
    fontWeight: '600', // Полужирный
    color: '#333', // Цвет текста метки
    marginRight: 8, // Отступ справа от метки
  },
  detailValue: { // Используется в DetailRow
    flex: 0.55, // Немного меньше места для значения
    color: '#555', // Цвет текста значения
    textAlign: 'left', // Выравнивание по левому краю для значения
  },
  description: { // Используется в PlantAdditionalInfo
    lineHeight: 22,
    color: '#555', // Цвет текста описания
    fontSize: 16, // Увеличен размер шрифта описания
  },
  actionsContainer: { // Не используется после рефакторинга?
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    marginBottom: 16,
    paddingTop: 16, // Добавлен отступ сверху
    borderTopWidth: 1, // Разделитель сверху
    borderTopColor: '#e0e0e0',
    flexWrap: 'wrap', // Разрешен перенос кнопок
  },
  actionButton: { // Не используется после рефакторинга?
    alignItems: 'center',
    padding: 10, // Добавлен внутренний отступ для области нажатия
    minWidth: 80, // Минимальная ширина для кнопок
    marginBottom: 10, // Отступ снизу для переноса
  },
  actionText: { // Не используется после рефакторинга?
    marginTop: 6, // Увеличен отступ
    fontSize: 12,
    color: '#333', // Цвет текста кнопки
    textAlign: 'center', // Центрирование текста
  },
  // Стили для галереи (ImageGallery)
  galleryContainer: {
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  galleryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
    color: '#333',
  },
  galleryItem: {
    width: 120,
    height: 90,
    marginHorizontal: 4,
    marginLeft: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  galleryImagePressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Добавляем затемнение при нажатии
  },
  galleryLoading: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  galleryError: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#ffebee',
  },
  mainImageBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mainImageText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Стили для карусели (ImageCarousel)
  imageCarouselContainer: {
    width: '100%',
    height: '100%', // Занимает всю высоту imageContainer
    position: 'relative',
  },
  carouselButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -25, // Половина высоты кнопки
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  carouselItemContainer: {
    height: '100%', // Занимает всю высоту imageContainer
    width: screenWidth, // Явно указываем ширину
  },
});

export default styles; 