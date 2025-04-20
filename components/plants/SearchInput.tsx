import React, { useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChangeText, 
  onToggleFilters, 
  showFilters 
}) => {
  const searchInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInner}>
        <Ionicons name="search" size={20} color="#4CAF50" style={styles.searchIcon} />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Поиск растений..."
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.optionsButton} 
          onPress={onToggleFilters}
        >
          <Ionicons 
            name={showFilters ? "options" : "options-outline"} 
            size={24} 
            color={showFilters ? "#4CAF50" : "#777"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
    color: '#4CAF50',
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  optionsButton: {
    padding: 8,
    borderRadius: 20,
  },
});

export default SearchInput; 