import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const dimensionsChangeHandler = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };
    
    const subscription = Dimensions.addEventListener('change', dimensionsChangeHandler);
    
    return () => subscription.remove();
  }, []);

  return dimensions;
}; 