import React, { useRef, useEffect, useState, memo, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useDropdownPosition } from './hooks/useDropdownPosition';
import { dropdownStyles as styles } from './styles';
import { DropdownProps, DropdownItem } from './types';

// Универсальный компонент Dropdown
// Используем дженерик T, чтобы компонент мог работать с разными типами данных,
// главное, чтобы они соответствовали интерфейсу DropdownItem
export const Dropdown = memo(function DropdownComponent<T extends DropdownItem>({
  items,
  selectedValue,
  onSelect,
  placeholder = 'Выберите значение',
  label,
  leftIconName,
  error,
  noDataMessage = 'Данные не найдены'
}: DropdownProps<T>) {
  const inputRef = useRef<View>(null);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  // Используем хук для определения позиции
  const { dropdownPosition, measurePosition } = useDropdownPosition(inputRef);

  // Анимация открытия/закрытия
  useEffect(() => {
    if (dropdownVisible) {
      Animated.spring(dropdownAnimation, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40
      }).start();
      measurePosition(); // Пересчитываем позицию при каждом открытии
    } else {
      Animated.spring(dropdownAnimation, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40
      }).start();
    }
  }, [dropdownVisible, dropdownAnimation, measurePosition]);

  // Обработка выбора элемента
  const handleSelect = (item: T) => {
    onSelect(item);
    setDropdownVisible(false);
  };

  // Переключение видимости
  const toggleDropdown = () => {
    if (!dropdownVisible) {
      measurePosition();
    }
    setDropdownVisible(!dropdownVisible);
  };

  // Находим отображаемое имя выбранного элемента
  const selectedItemName = useMemo(() => {
    const selectedItem = items.find(item => item.id === selectedValue);
    return selectedItem ? selectedItem.name : null;
  }, [items, selectedValue]);

  // Рендеринг списка
  const renderDropdown = () => {
    if (!dropdownVisible) return null;

    return (
      <Animated.View
        style={[
          styles.appleDropdown,
          {
            width: "100%",
            marginTop: 4,
            zIndex: 9999,
            elevation: 5,
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
        {items && items.length > 0 ? (
          <ScrollView
            style={styles.dropdownList}
            contentContainerStyle={styles.dropdownListContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled // Для работы внутри других ScrollView
          >
            {items.map((item, index) => (
              <React.Fragment key={item.id.toString()}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(item)}
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
                  {selectedValue === item.id && (
                    <Ionicons name="checkmark" size={18} color={Colors.light.primary} />
                  )}
                </TouchableOpacity>
                {index < items.length - 1 && (
                  <View style={styles.dropdownSeparator} />
                )}
              </React.Fragment>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.dropdownList}>
            <Text style={styles.noDataText}>{noDataMessage}</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.fieldContainer, { position: 'relative', zIndex: dropdownVisible ? 9999 : 1 }]}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      <View
        ref={inputRef}
        collapsable={false} // Важно для корректных измерений
        style={{ position: 'relative', zIndex: dropdownVisible ? 9999 : 1 }}
      >
        <TouchableOpacity
          style={[
            styles.inputContainer,
            styles.dropdownInput,
            error ? styles.errorInput : null
          ]}
          onPress={toggleDropdown}
          activeOpacity={0.8}
        >
          {leftIconName && (
            <View style={styles.leftIcon}>
              <Ionicons name={leftIconName} size={20} color={Colors.light.primary} />
            </View>
          )}
          <Text style={[
            styles.textInput,
            !selectedItemName && styles.placeholderText
          ]}>
            {selectedItemName || placeholder}
          </Text>
          <Ionicons
            name={dropdownVisible ? "chevron-up" : "chevron-down"}
            size={20}
            color={Colors.light.primary}
          />
        </TouchableOpacity>

        {/* Выпадающий список рендерится теперь внутри родительского контейнера */}
        {renderDropdown()}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

// Оставляем только именованный экспорт константы Dropdown 