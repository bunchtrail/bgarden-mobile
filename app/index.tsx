import { Redirect } from 'expo-router';

export default function Index() {
  // По умолчанию перенаправляем на главную страницу
  return <Redirect href="/(tabs)" />;
} 