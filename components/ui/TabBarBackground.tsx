import { View } from 'react-native';

// This is a shim for web and Android where the tab bar is generally opaque.
export function TabBarBackground({ color }: { color: string }) {
  return <View style={{ flex: 1, backgroundColor: color }} />;
}

export function useBottomTabOverflow() {
  return 0;
}
