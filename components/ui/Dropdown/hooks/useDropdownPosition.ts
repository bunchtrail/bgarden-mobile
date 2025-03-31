import { useState, useCallback, useEffect } from 'react';
import { Dimensions, View, ScrollView, findNodeHandle } from 'react-native';

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

export const useDropdownPosition = (componentRef: React.RefObject<View>) => {
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ 
    top: 0, 
    left: 0, 
    width: 0 
  });
  
  // Измерение положения компонента для корректного размещения выпадающего списка
  const measurePosition = useCallback(() => {
    if (componentRef.current) {
      // Используем measure вместо measureInWindow для более точного позиционирования
      componentRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPosition({
          top: height, // Позиционируем прямо под элементом
          left: 0,     // Используем 0, так как мы внутри родительского контейнера
          width: width
        });
      });
    }
  }, [componentRef]);

  // Обработка изменения размеров экрана
  useEffect(() => {
    const handleDimensionsChange = () => {
      // При изменении размеров экрана мы должны пересчитать позицию
      measurePosition();
    };

    // Подписываемся на изменение размеров экрана
    const subscription = Dimensions.addEventListener('change', handleDimensionsChange);

    // Отписываемся при размонтировании компонента
    return () => {
      subscription.remove();
    };
  }, [measurePosition]);

  return {
    dropdownPosition,
    measurePosition
  };
};

// Больше не нужен дефолтный экспорт, так как используем именованный
// export default useDropdownPosition; 