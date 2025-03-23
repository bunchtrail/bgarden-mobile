import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Linking } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/ThemedText';
import { useAnimatedSection } from '@/hooks/animations/useAnimatedSection';
import SectionCard from '../SectionCard';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ContactsSectionProps {
  delay?: number;
}

export default function ContactsSection({ delay = 0 }: ContactsSectionProps) {
  const { animatedStyle } = useAnimatedSection(delay);
  const primaryColor = useThemeColor({}, 'primary');
  
  return (
    <Animated.View style={[styles.sectionContainer, animatedStyle]}>
      <SectionCard icon="call-outline" title="Контакты">
        <TouchableOpacity 
          style={styles.contactItem} 
          onPress={() => Linking.openURL('https://maps.google.com/?q=Киров,ул.КарлаМаркса,95')}
        >
          <Ionicons name="location-outline" size={24} color={primaryColor} style={styles.contactIcon} />
          <ThemedText style={styles.contactText}>г. Киров, ул. Карла Маркса, 95</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.contactItem} 
          onPress={() => Linking.openURL('tel:+78332640500')}
        >
          <Ionicons name="call-outline" size={24} color={primaryColor} style={styles.contactIcon} />
          <ThemedText style={styles.contactText}>+7 (8332) 64-05-00</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.contactItem} 
          onPress={() => Linking.openURL('tel:+78332742806')}
        >
          <Ionicons name="call-outline" size={24} color={primaryColor} style={styles.contactIcon} />
          <ThemedText style={styles.contactText}>+7 (8332) 742-806 (экскурсии)</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.contactItem} 
          onPress={() => Linking.openURL('mailto:botsad43@mail.ru')}
        >
          <Ionicons name="mail-outline" size={24} color={primaryColor} style={styles.contactIcon} />
          <ThemedText style={styles.contactText}>botsad43@mail.ru</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.contactItem} 
        >
          <Ionicons name="person-outline" size={24} color={primaryColor} style={styles.contactIcon} />
          <ThemedText style={styles.contactText}>Руководитель: Екатерина Лелекова</ThemedText>
        </TouchableOpacity>
        <View style={styles.socialContainer}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => Linking.openURL('https://vk.com/botsadvyatsu')}
          >
            <Ionicons name="logo-vk" size={24} color={primaryColor} />
          </TouchableOpacity>
        </View>
      </SectionCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  contactIcon: {
    marginRight: 16,
  },
  contactText: {
    flex: 1,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
}); 