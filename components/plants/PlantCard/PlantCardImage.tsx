import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useSpecimenImage } from '@/modules/plants/hooks';

interface PlantCardImageProps {
  specimenId: number;
  mainImage?: string;
  illustration?: string;
}

const PlantCardImage: React.FC<PlantCardImageProps> = ({ 
  specimenId, 
  mainImage, 
  illustration 
}) => {
  const { imageSrc } = useSpecimenImage(specimenId);
  
  const imageUrl = imageSrc || 
    mainImage || 
    illustration || 
    'https://via.placeholder.com/400x600.png?text=Plant+Image';

  return (
    <Image
      source={{ uri: imageUrl }}
      style={styles.image}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default PlantCardImage; 