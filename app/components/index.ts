// Компоненты основного интерфейса
// export { Button } from './Button';
// export { Header } from './Header';
// export { ThemedText } from './ThemedText';
// export { ThemedView } from './ThemedView';
export { default as PageHeader } from './PageHeader';
export { default as SectionCard } from './SectionCard';

// Секционные компоненты
export { default as AboutSection } from './sections/AboutSection';
export { default as MapSection } from './sections/MapSection';
export { default as WorkHoursSection } from './sections/WorkHoursSection';
export { default as ContactsSection } from './sections/ContactsSection';
export { default as AuthSection } from './sections/AuthSection';

// Экспорт всех компонентов по умолчанию
import PageHeader from './PageHeader';
import SectionCard from './SectionCard';
import AboutSection from './sections/AboutSection';
import MapSection from './sections/MapSection';
import WorkHoursSection from './sections/WorkHoursSection';
import ContactsSection from './sections/ContactsSection';
import AuthSection from './sections/AuthSection';

export default {
  PageHeader,
  SectionCard,
  AboutSection,
  MapSection,
  WorkHoursSection,
  ContactsSection,
  AuthSection
}; 