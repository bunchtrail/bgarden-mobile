// Импорты в начале файла
import PageHeader from './PageHeader';
import AboutSection from './sections/AboutSection';
import MapSection from './sections/MapSection';
import WorkHoursSection from './sections/WorkHoursSection';
import ContactsSection from './sections/ContactsSection';
import AuthSection from './sections/AuthSection';
import { Button, Header, ThemedText, ThemedView } from '@/components';

// Компоненты основного интерфейса
export { Button, Header, ThemedText, ThemedView };
export { default as PageHeader } from './PageHeader';

// Секционные компоненты
export { default as AboutSection } from './sections/AboutSection';
export { default as MapSection } from './sections/MapSection';
export { default as WorkHoursSection } from './sections/WorkHoursSection';
export { default as ContactsSection } from './sections/ContactsSection';
export { default as AuthSection } from './sections/AuthSection';

// Экспорт всех компонентов по умолчанию
export default {
  PageHeader,
  AboutSection,
  MapSection,
  WorkHoursSection,
  ContactsSection,
  AuthSection
}; 