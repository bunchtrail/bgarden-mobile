/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#4A8F6D';
const tintColorDark = '#8FBE9F';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    tabBarLight: 'rgba(255, 255, 255, 0.85)',
    tabBarDark: 'rgba(21, 23, 24, 0.85)',
    primary: '#4A8F6D',
    secondary: '#E0E0E0',
    card: '#F8F8F8',
    border: '#E2E8F0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    tabBarLight: 'rgba(255, 255, 255, 0.85)',
    tabBarDark: 'rgba(21, 23, 24, 0.85)',
    primary: '#6AAC87',
    secondary: '#2C2C2C',
    card: '#1E1E1E',
    border: '#2A2A2A',
  },
};
