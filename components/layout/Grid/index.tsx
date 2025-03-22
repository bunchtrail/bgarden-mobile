import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, useWindowDimensions } from 'react-native';

interface GridProps {
  children: React.ReactNode;
  numColumns?: number | { small: number; medium: number; large: number };
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

interface ColumnProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  width: number;
  spacing: number;
  index: number;
}

const Column = ({ children, style, width, spacing, index }: ColumnProps) => {
  return (
    <View
      style={[
        {
          width: `${width}%`,
          paddingLeft: index % 2 === 0 ? 0 : spacing / 2,
          paddingRight: index % 2 === 0 ? spacing / 2 : 0,
          marginBottom: spacing,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const Grid = React.memo(({
  children,
  numColumns = 2,
  spacing = 10,
  style,
}: GridProps) => {
  const { width } = useWindowDimensions();
  
  // Определение количества колонок в зависимости от ширины экрана
  const columns = useMemo(() => {
    if (typeof numColumns === 'number') {
      return numColumns;
    }
    
    // Планшет в альбомной ориентации или большой экран
    if (width >= 768) {
      return numColumns.large;
    }
    
    // Планшет или телефон в альбомной ориентации
    if (width >= 480) {
      return numColumns.medium;
    }
    
    // Телефон
    return numColumns.small;
  }, [numColumns, width]);
  
  const renderColumns = () => {
    const childrenArray = React.Children.toArray(children);
    const columnWidth = 100 / columns;
    
    return childrenArray.map((child, index) => (
      <Column
        key={index}
        width={columnWidth}
        spacing={spacing}
        index={index}
      >
        {child}
      </Column>
    ));
  };
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>{renderColumns()}</View>
    </View>
  );
});

Grid.displayName = 'Grid';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}); 