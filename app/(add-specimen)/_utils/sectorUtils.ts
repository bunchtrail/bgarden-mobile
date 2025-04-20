// Вспомогательная функция для заголовка в "простом" режиме
export const getSectorName = (sectorType: number): string => {
  switch (sectorType) {
    case 0:
      return 'Дендрология';
    case 1:
      return 'Флора';
    case 2:
      return 'Цветоводство';
    default:
      return 'Не указан';
  }
}; 

export default getSectorName;