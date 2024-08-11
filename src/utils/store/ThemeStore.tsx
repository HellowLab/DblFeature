import { create } from 'zustand';
import { useColorScheme } from 'react-native';
import { ColorSchemeName } from 'react-native';
import { MMKV } from 'react-native-mmkv';

// Create an MMKV instance
const storage = new MMKV();

interface ThemeState {
  theme: ColorSchemeName;
  toggleTheme: () => void;
  setTheme: (theme: ColorSchemeName) => void;
}

// Helper functions to read and write the theme from MMKV
// If MMKV does not have theme saved, use system theme
const getStoredTheme = (): ColorSchemeName => {
  const storedTheme = storage.getString('theme');
  if (storedTheme) {
    return storedTheme === 'dark' ? 'dark' : 'light';
  }
  else {
    // default to light mode? or should we use system theme?
    // const systemTheme: ColorSchemeName = useColorScheme(); // can't use this hook here
    return "light"
  }
};

const setStoredTheme = (theme: ColorSchemeName) => {
  storage.set('theme', theme);
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
    setStoredTheme(theme);
    set({ theme });
  },
}));

export default useThemeStore;
