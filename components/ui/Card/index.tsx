import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'outlined' | 'elevated';
}

export const Card = React.memo(({ 
  title, 
  children, 
  onPress, 
  style,
  variant = 'default'
}: CardProps) => {
  const Container = onPress ? TouchableOpacity : View;
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  
  const variantStyle = React.useMemo(() => {
    switch(variant) {
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor,
          shadowOpacity: 0,
          elevation: 0,
        };
      case 'elevated':
        return {
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 4,
        };
      case 'default':
      default:
        return {
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        };
    }
  }, [variant, borderColor]);
  
  return (
    <ThemedView 
      style={[
        styles.card, 
        variantStyle,
        style
      ]} 
      lightColor={cardColor}
      darkColor={cardColor}
    >
      <Container 
        onPress={onPress} 
        style={styles.container}
        activeOpacity={onPress ? 0.8 : 1}
      >
        {title && (
          <ThemedText 
            type="subtitle" 
            style={styles.title} 
            lightColor={textColor}
            darkColor={textColor}
          >
            {title}
          </ThemedText>
        )}
        {children}
      </Container>
    </ThemedView>
  );
});

Card.displayName = 'Card';

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
  },
  container: {
    width: '100%',
  },
  title: {
    marginBottom: 12,
  },
}); 