import { Ionicons } from '@expo/vector-icons';

// Базовый тип для элемента списка
export interface DropdownItem {
  id: string | number;
  name: string;
  description?: string;
}

// Props для компонента Dropdown
export interface DropdownProps<T extends DropdownItem> {
  items: T[]; // Массив элементов для отображения в списке
  selectedValue: string | number | undefined; // ID выбранного элемента
  onSelect: (item: T) => void; // Функция обратного вызова при выборе элемента
  placeholder?: string; // Текст плейсхолдера
  label?: string; // Метка над полем ввода
  leftIconName?: keyof typeof Ionicons.glyphMap; // Имя иконки слева
  error?: string; // Текст ошибки для отображения
  noDataMessage?: string; // Сообщение при отсутствии данных
} 