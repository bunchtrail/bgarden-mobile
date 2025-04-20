import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PlantCardDetailRowProps {
  label: string;
  value: string | null | undefined;
}

const PlantCardDetailRow: React.FC<PlantCardDetailRowProps> = ({ label, value }) => {
  if (!value) return null;
  
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#BBBBBB',
    fontSize: 14,
    width: 'auto',
    marginRight: 8,
  },
  detailValue: {
    color: 'white',
    fontSize: 12,
    flex: 1,
    marginTop: 5,
  },
});

export default PlantCardDetailRow; 