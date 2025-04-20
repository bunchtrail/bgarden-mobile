import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Specimen, UserRole } from '@/types';
import PlantCardHeader from './PlantCardHeader';
import PlantCardImage from './PlantCardImage';
import PlantCardDetails from './PlantCardDetails';
import PlantCardActions from './PlantCardActions';

const { width } = Dimensions.get('window');

interface PlantCardProps {
  specimen: Specimen;
  isActive: boolean;
  userRole: UserRole;
  onPress: () => void;
  height?: number;
}

const PlantCard: React.FC<PlantCardProps> = ({ 
  specimen, 
  isActive, 
  userRole, 
  onPress, 
  height 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isActive ? 1 : 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isActive, fadeAnim]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const specimenName = specimen.russianName || 'Без названия';
  const latinName = specimen.latinName || 
    (specimen.genus && specimen.species ? 
      `${specimen.genus} ${specimen.species}` : 
      'Без латинского названия'
    );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, height: height }]}>
      <PlantCardImage 
        specimenId={specimen.id} 
        mainImage={specimen.mainImage} 
        illustration={specimen.illustration}
      />
      <TouchableOpacity style={styles.infoContainer} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.headerActionsContainer}>
          <View style={styles.headerTextContainer}>
            <PlantCardHeader russianName={specimenName} latinName={latinName} />
          </View>
          <PlantCardActions userRole={userRole} />
        </View>

        <TouchableOpacity style={styles.detailsButton} onPress={toggleDetails}>
          <Text style={styles.detailsButtonText}>
            {showDetails ? 'Скрыть детали' : 'Показать детали'}
          </Text>
          <Ionicons
            name={showDetails ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="white"
          />
        </TouchableOpacity>

        {showDetails && <PlantCardDetails specimen={specimen} userRole={userRole} />}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: '#000',
    marginVertical: 0,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTextContainer: {
    // This container prevents the header from stretching
    // No specific flex properties needed, it will take natural width
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 16,
    marginRight: 5,
  },
});

export default PlantCard; 