// theme.ts
const error = '#ef4444';
const success = '#10b981';
const p1 = '#0284c7';
const p2 = '#1b90cc';
const p3 = '#349cd2';
const p4 = '#4da8d7';
const p5 = '#67b5dd';
const p6 = '#80c1e3';

export const Colors = {
  light: {
    primary: p1,
    p2: p2,
    p3: p3,
    p4: p4,
    p5: p5,
    p6: p6,
    background: 'rgb(242, 242, 242)',
    b2: '#eceff1',
    b3: '#cfd8dc',
    b4: '#b0bec5',
    b5: '#90a4ae',
    b6: '#78909c',
    card: 'rgb(255, 255, 255)',
    text: '#222',
    textmuted: '#6b7280',
    textinverted: '#fff',
    error: error,
    success: success,
    border: '#d1d5db',
    inverted: '#121212',
    notification: 'rgb(255, 69, 58)',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    primary: '#0284c7',
    p2: p2,
    p3: p3,
    p4: p4,
    p5: p5,
    p6: p6,
    background: '#1e2125',
    b2: '#23272b',
    b3: '#292e33',
    b4: '#575757',
    b5: '#717171',
    b6: '#8b8b8b',
    card: '#171a1d',
    text: '#fff',
    textmuted: '#ccc',
    textinverted: '#222',
    error: error,
    success: success,
    border: '#394148',
    inverted: '#fff',
    notification: 'rgb(255, 69, 58)',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

export type CustomThemeColors = typeof Colors.light;

export type CustomTheme = {
  dark: boolean;
  colors: CustomThemeColors;
};

export const lightTheme: CustomTheme = {
  dark: false,
  colors: Colors.light,
};

export const darkTheme: CustomTheme = {
  dark: true,
  colors: Colors.dark,
};
