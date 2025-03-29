export interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
} 