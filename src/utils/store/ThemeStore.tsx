import { create } from 'zustand';
import { useColorScheme } from 'react-native';
import { MMKV } from 'react-native-mmkv';

// Import Custom Types
import { ColorSchemeName } from '@/src/utils/types/types';

// Create an MMKV instance
const storage = new MMKV();

interface ThemeState {
  theme: ColorSchemeName;
  toggleTheme: () => void;
  setTheme: (theme: ColorSchemeName) => void;
}

// Helper functions to read the theme from MMKV
// If MMKV does not have theme saved, use system theme
const getStoredTheme = (): ColorSchemeName => {
  const storedTheme = storage.getString('theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme as ColorSchemeName;
  }
  return 'system';
};

// Helper function to save the theme to MMKV
const setStoredTheme = (theme: ColorSchemeName) => {
  if (theme === 'light' || theme === 'dark' || theme === 'system') {
    storage.set('theme', theme);
    return theme;
  }
  storage.set('theme', 'system');
};

// Zustand store with MMKV persistence
const useThemeStore = create<ThemeState>((set) => ({
  theme: getStoredTheme(),
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      setStoredTheme(newTheme);
      return { theme: newTheme };
    }),
  setTheme: (theme: ColorSchemeName) => {
    set({ theme });
  },
}));

export default useThemeStore;
