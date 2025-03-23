import React, { useState } from 'react';
import { View, StyleSheet, Animated, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/ThemedText';
import { useAnimatedSection } from '@/hooks/animations/useAnimatedSection';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SectionCard } from '@/components/layout';
import { Button } from '@/components/Button';

// Включаем анимации макета для Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AboutSectionProps {
  delay?: number;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
}

// Компонент сворачиваемой секции
const CollapsibleSection = ({ title, children, initiallyExpanded = false }: CollapsibleSectionProps) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'background');
  
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  
  return (
    <View style={styles.collapsibleSection}>
      <TouchableOpacity 
        style={[styles.collapsibleHeader, expanded && styles.expandedHeader]} 
        onPress={toggleExpand}
        activeOpacity={0.7}
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
      >
        <ThemedText style={styles.subTitle}>{title}</ThemedText>
        <View style={[styles.iconContainer, expanded && { backgroundColor: `${primaryColor}20` }]}>
          <Ionicons 
            name={expanded ? 'chevron-up' : 'chevron-down'} 
            size={16} 
            color={primaryColor} 
          />
        </View>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.collapsibleContent}>
          {children}
        </View>
      )}
    </View>
  );
};

export default function AboutSection({ delay = 0 }: AboutSectionProps) {
  const { animatedStyle } = useAnimatedSection(delay);
  const primaryColor = useThemeColor({}, 'primary');
  
  return (
    <Animated.View style={[styles.sectionContainer, animatedStyle]}>
      <SectionCard icon="leaf-outline" title="О ботаническом саде">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <ThemedText style={styles.sectionText}>
            Научно-образовательный центр "Ботанический сад ВятГУ" основан в 1912-1914 годах. 
            Расположен в центре Кирова и занимает площадь 1,7 га.
          </ThemedText>
          
          <CollapsibleSection title="Коллекция растений">
            <ThemedText style={styles.sectionText}>
              В коллекции сада насчитывается более 100 видов деревьев и кустарников, а также несколько 
              сотен видов мелких растений. Особую ценность представляют более 80 видов растений, 
              занесенных в Красную книгу.
            </ThemedText>
          </CollapsibleSection>
          
          <CollapsibleSection title="Тематические зоны">
            <View style={styles.listContainer}>
              {[
                'Дендрарий',
                'Отдел цветоводства с иридарием',
                'Грот с родником и бассейн',
                'Зона декоративных кустарников',
                'Теплица с тропическими растениями',
                '"Аптекарский огород"'
              ].map((item, index) => (
                <View key={index} style={styles.listItemRow}>
                  <ThemedText style={styles.bulletPoint}>•</ThemedText>
                  <ThemedText style={styles.listItem}>{item}</ThemedText>
                </View>
              ))}
            </View>
          </CollapsibleSection>
          
          <CollapsibleSection title="Специальные коллекции">
            <View style={styles.listContainer}>
              {[
                'Астильбы, лилии, лилейники, ирисы',
                'Флоксы, розы, клематисы, хризантемы',
                'Растения из разных регионов России'
              ].map((item, index) => (
                <View key={index} style={styles.listItemRow}>
                  <ThemedText style={styles.bulletPoint}>•</ThemedText>
                  <ThemedText style={styles.listItem}>{item}</ThemedText>
                </View>
              ))}
            </View>
          </CollapsibleSection>
          
          <CollapsibleSection title="Информация для посетителей" initiallyExpanded={true}>
            <View style={styles.visitorInfoContainer}>
              <View style={styles.visitorInfoItem}>
                <ThemedText style={styles.infoLabel}>Руководитель:</ThemedText>
                <ThemedText style={styles.infoValue}>Екатерина Лелекова</ThemedText>
              </View>
              
              <View style={styles.visitorInfoItem}>
                <ThemedText style={styles.infoLabel}>Стоимость:</ThemedText>
                {[
                  'Полный билет: 150 руб.',
                  'Льготный билет: 120 руб.',
                  'Бесплатно: инвалиды, дети до 4-х лет, студенты ВятГУ'
                ].map((item, index) => (
                  <View key={index} style={styles.listItemRow}>
                    <ThemedText style={styles.bulletPoint}>•</ThemedText>
                    <ThemedText style={styles.listItem}>{item}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </CollapsibleSection>
          
          <View style={styles.statsContainer}>
            {[
              { number: '100+', label: 'Видов деревьев' },
              { number: '80+', label: 'Редких растений' },
              { number: '1912', label: 'Год основания' }
            ].map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <ThemedText style={[styles.statNumber, { color: primaryColor }]}>
                  {stat.number}
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  {stat.label}
                </ThemedText>
              </View>
            ))}
          </View>
        </ScrollView>
      </SectionCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  sectionText: {
    lineHeight: 22,
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  listContainer: {
    marginBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.01)',
    borderRadius: 8,
    padding: 12,
  },
  listItemRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    marginRight: 8,
  },
  listItem: {
    flex: 1,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  collapsibleSection: {
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 12,
    marginHorizontal: -4,
    paddingHorizontal: 4,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  expandedHeader: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapsibleContent: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  visitorInfoContainer: {
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.01)',
    borderRadius: 8,
    padding: 12,
  },
  visitorInfoItem: {
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(0,0,0,0.1)',
    paddingLeft: 12,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 15,
  },
  infoValue: {
    marginBottom: 8,
  },
}); 