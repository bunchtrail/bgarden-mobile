import { useState, useCallback, useEffect } from 'react';
import { Dimensions, View } from 'react-native';

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
      componentRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setDropdownPosition({
          top: y + height,
          left: x,
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