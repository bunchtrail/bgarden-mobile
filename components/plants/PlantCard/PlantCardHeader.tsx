import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PlantCardHeaderProps {
  russianName: string;
  latinName: string;
}

const PlantCardHeader: React.FC<PlantCardHeaderProps> = ({ russianName, latinName }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.russianName}>{russianName}</Text>
      <Text style={styles.latinName}>{latinName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  russianName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  latinName: {
    color: '#E0E0E0',
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 5,
  },
});

export default PlantCardHeader; 