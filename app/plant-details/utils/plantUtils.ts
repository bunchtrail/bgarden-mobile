import { SectorType } from '@/types';

// --- ФУНКЦИЯ ПРЕОБРАЗОВАНИЯ ТИПА СЕКТОРА ---
export const getSectorTypeName = (type: number): string => {
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

export default { getSectorTypeName }; 