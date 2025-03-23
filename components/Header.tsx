import React from 'react';
import { Image, StyleSheet, View, ViewStyle, StyleProp, TextStyle, ImageStyle } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface HeaderProps {
  style?: StyleProp<ViewStyle>;
  logoStyle?: StyleProp<ImageStyle>;
  titleStyle?: StyleProp<TextStyle>;
  titleColor?: string;
  title?: string;
  logoSource?: number | { uri: string };
  subtitle?: string;
  subtitleStyle?: StyleProp<TextStyle>;
}

export function Header({ 
  style, 
  logoStyle, 
  titleStyle, 
  titleColor, 
  title = 'Ботанический сад ВятГУ', 
  logoSource,
  subtitle,
  subtitleStyle
}: HeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <Image 
        source={logoSource || require('@/assets/images/splash-icon.png')} 
        style={[styles.logo, logoStyle]} 
      />
      <ThemedText 
        type="title" 
        style={[styles.title, titleStyle]} 
        lightColor={titleColor} 
        darkColor={titleColor}
      >
        {title}
      </ThemedText>
      
      {subtitle && (
        <ThemedText 
          style={[styles.subtitle, subtitleStyle]} 
          lightColor={titleColor} 
          darkColor={titleColor}
        >
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  logo: {
    height: 80,
    width: 80,
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 16,
    fontStyle: 'italic',
  }
}); 