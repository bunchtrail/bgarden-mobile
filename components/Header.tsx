import React from 'react';
import { Image, StyleSheet, View, ViewStyle, StyleProp, TextStyle, ImageStyle } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface HeaderProps {
  style?: StyleProp<ViewStyle>;
  logoStyle?: StyleProp<ImageStyle>;
  titleStyle?: StyleProp<TextStyle>;
  titleColor?: string;
}

export function Header({ style, logoStyle, titleStyle, titleColor }: HeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <Image source={require('@/assets/images/splash-icon.png')} style={[styles.logo, logoStyle]} />
      <ThemedText type="title" style={[styles.title, titleStyle]} lightColor={titleColor} darkColor={titleColor}>
        Ботанический сад ВятГУ
      </ThemedText>
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
}); 