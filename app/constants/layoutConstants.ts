import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Фиксированные высоты элементов интерфейса
export const TAB_BAR_HEIGHT = 80;
export const HEADER_HEIGHT = 60;
export const FILTER_BAR_HEIGHT = 60;
export const BOTTOM_MARGIN = 50;
export const SAFETY_MARGIN = 20;

// Фиксированная высота карточки
export const FIXED_CARD_HEIGHT = height - TAB_BAR_HEIGHT - HEADER_HEIGHT - 
  FILTER_BAR_HEIGHT - BOTTOM_MARGIN - SAFETY_MARGIN;

export const SCREEN_DIMENSIONS = { width, height };

// Мемоизация результатов логирования для избежания дублирования
let lastDimensionsLog: string | null = null;

export const logScreenDimensions = () => {
  const dimensionsData = { 
    экранВысота: height, 
    экранШирина: width,
    фиксированнаяВысотаКарточки: FIXED_CARD_HEIGHT,
    вычеты: {
      панельВкладок: TAB_BAR_HEIGHT,
      заголовок: HEADER_HEIGHT,
      фильтры: FILTER_BAR_HEIGHT,
      запасБезопасности: SAFETY_MARGIN,
      отступСнизу: BOTTOM_MARGIN,
      общийВычет: TAB_BAR_HEIGHT + HEADER_HEIGHT + FILTER_BAR_HEIGHT + BOTTOM_MARGIN + SAFETY_MARGIN
    }
  };
  
  const dimensionsString = JSON.stringify(dimensionsData);
  
  // Выводим лог только если изменились размеры
  if (dimensionsString !== lastDimensionsLog) {
    lastDimensionsLog = dimensionsString;
  }
}; 