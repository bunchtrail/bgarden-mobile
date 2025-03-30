// Реэкспорт базовых компонентов
export * from './ui';

// Реэкспорт компонентов обратной связи
export * from './feedback';

// Реэкспорт компонентов макета
export * from './layout';

// Реэкспорт компонентов растений
export * from './plants';

// Реэкспорт компонентов тестирования хранилищ
export * from './storage-test';

// Импорт и экспорт компонентов из common и debug
import LoadingIndicator from './common/LoadingIndicator';
import DebugInfo from './debug/DebugInfo';
export { LoadingIndicator, DebugInfo };

// Импорт и экспорт компонентов секций
import AuthSection from './sections/AuthSection';
import WorkHoursSection from './sections/WorkHoursSection';
import MapSection from './sections/MapSection';
import ContactsSection from './sections/ContactsSection';
import AboutSection from './sections/AboutSection';
import PageHeader from './PageHeader';
export { AuthSection, WorkHoursSection, MapSection, ContactsSection, AboutSection, PageHeader };

// Экспорт нового компонента главной страницы
export { default as HomePage } from './HomePage';

// Удаляем импорт из auth, чтобы избежать цикла
// import { AuthButton } from '@/modules/auth/components';
// export { AuthButton };

// Существующие компоненты
export { Button } from './Button';
export { ThemedText } from './ThemedText';
export { ThemedView } from './ThemedView';
export { Header } from './Header';
export { default as GardenMap } from './GardenMap';
export { default as ParallaxScrollView } from './ParallaxScrollView';
export * from './time-based-greeting'; 