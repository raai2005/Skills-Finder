/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';
const secondaryTintLight = '#5e35b1';
const secondaryTintDark = '#b39ddb';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    secondaryTint: secondaryTintLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    inputBackground: '#f5f5f5',
    border: '#e0e0e0',
    placeholderText: '#a0a0a0',
    cardBackground: '#ffffff',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    secondaryTint: secondaryTintDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    inputBackground: '#2a2a2a',
    border: '#3a3a3a',
    placeholderText: '#6a6a6a',
    cardBackground: '#252525',
    success: '#81C784',
    error: '#E57373',
    warning: '#FFD54F',
    info: '#64B5F6',
  },
};
