import React, { useRef, useEffect, memo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Family } from '@/types';
import { styles } from '../styles';

interface FamilyDropdownProps {
  families: Family[];
  familyId: string;
  familyName: string;
  setFamilyId: (value: string) => void;
  setFamilyName: (value: string) => void;
  dropdownVisible: boolean;
  setDropdownVisible: (visible: boolean) => void;
  error?: string;
}

export const FamilyDropdown = memo(function FamilyDropdownComponent({
  families,
  familyId,
  familyName,
  setFamilyId,
  setFamilyName,
  dropdownVisible,
  setDropdownVisible,
  error
}: FamilyDropdownProps) {
  const familyInputRef = useRef<View>(null);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });

  // Анимация открытия/закрытия выпадающего списка
  useEffect(() => {
    if (dropdownVisible) {
      // Открываем выпадающий список с анимацией
      Animated.spring(dropdownAnimation, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40
      }).start();
      
      // Измеряем положение при каждом открытии
      measurePosition();
    } else {
      // Закрываем выпадающий список с анимацией
      Animated.spring(dropdownAnimation, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40
      }).start();
    }
  }, [dropdownVisible]);

  // Измерение положения компонента для корректного размещения выпадающего списка
  const measurePosition = () => {
    if (familyInputRef.current) {
      familyInputRef.current.measureInWindow((x, y, width, height) => {
        setDropdownPosition({
          top: y + height,
          left: x,
          width: width
        });
      });
    }
  };

  // Обработка выбора семейства из списка
  const handleFamilySelect = (family: Family) => {
    setFamilyId(family.id.toString());
    setFamilyName(family.name);
    setDropdownVisible(false);
  };

  // Переключение видимости выпадающего списка
  const toggleFamilyDropdown = () => {
    if (!dropdownVisible) {
      measurePosition();
    }
    setDropdownVisible(!dropdownVisible);
  };

  // Отрисовываем выпадающий список
  const renderDropdown = () => {
    if (!dropdownVisible) return null;

    return (
      <Animated.View 
        style={[
          styles.appleDropdown,
          {
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            opacity: dropdownAnimation,
            transform: [{ 
              scale: dropdownAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1]
              }) 
            }]
          }
        ]}
      >
        {families && families.length > 0 ? (
          <ScrollView
            style={styles.dropdownList}
            contentContainerStyle={styles.dropdownListContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            {families.map((item, index) => (
              <React.Fragment key={item.id.toString()}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleFamilySelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dropdownItemContent}>
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                    {item.description && (
                      <Text style={styles.dropdownItemDescription} numberOfLines={1}>
                        {item.description}
                      </Text>
                    )}
                  </View>
                  {familyId === item.id.toString() && (
                    <Ionicons name="checkmark" size={18} color={Colors.light.primary} />
                  )}
                </TouchableOpacity>
                
                {/* Разделительная линия между пунктами */}
                {index < families.length - 1 && (
                  <View style={styles.dropdownSeparator} />
                )}
              </React.Fragment>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.dropdownList}>
            <Text style={styles.noDataText}>Семейства не найдены</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.fieldContainer, { position: 'relative', zIndex: 100 }]}>
      <Text style={styles.fieldLabel}>Семейство</Text>
      <View 
        ref={familyInputRef}
        collapsable={false} // Важно для корректных измерений на Android
        style={{ position: 'relative' }}
      >
        <TouchableOpacity
          style={[
            styles.inputContainer,
            styles.dropdownInput,
            error ? styles.errorInput : null
          ]}
          onPress={toggleFamilyDropdown}
          activeOpacity={0.8}
        >
          <View style={styles.leftIcon}>
            <Ionicons name="leaf-outline" size={20} color={Colors.light.primary} />
          </View>
          <Text style={[
            styles.textInput, 
            styles.inputWithIcon,
            !familyName && styles.placeholderText
          ]}>
            {familyName || 'Выберите семейство растения'}
          </Text>
          <Ionicons 
            name={dropdownVisible ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={Colors.light.primary} 
          />
        </TouchableOpacity>
        
        {/* Выпадающий список */}
        {renderDropdown()}
      </View>
      
      {/* Сообщение об ошибке */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

export default FamilyDropdown; 