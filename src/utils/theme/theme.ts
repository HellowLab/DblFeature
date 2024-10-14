import { DefaultTheme, DarkTheme } from "@react-navigation/native";

// Updated Blues for Light Mode
const lightPrimary = "#3769A3"; // More pronounced blue for primary actions
const lightBackground = "#F4F4F4"; // Off white for  background
const lightCard = "#F8F8F8"; // Off white, slightly ligher than background for cards
const lightAccent = "#9CBBDE"; // Slightly lighter blue for accents
const lightText = "#223C54"; // Darker blue text for readability

// Dark Mode (Unchanged)
const darkPrimary = lightPrimary; // Bright blue for accents in dark mode
const darkBackground = "#0A1C30"; // Darkest blue background for dark mode
const darkCard = "#142843"; // Slightly lighter blue for cards
const darkAccent = "#2E5C9C"; // Deep blue for actions in dark mode
const darkText = "#DDEAF6"; // Light blue text for dark mode

export const Colors = {
  light: {
    primary: lightPrimary, // Your light theme primary color
    background: lightBackground, // Light theme background
    card: lightCard, // Light theme card background
    text: lightText, // Light theme text color
    border: "#D1D5DB", // Light theme border color
    accent: lightAccent, // Light theme accent color
    inverted: "#FFFFFF", // White for text on dark backgrounds
    white: "#FFFFFF", // Explicitly define white
    black: "#000000", // Explicitly define black
    success: "#28A745", // Success color
    error: "#DC3545", // Error color
    warning: "#FFC107", // Warning color
  },
  dark: {
    primary: darkPrimary, // Your dark theme primary color
    background: darkBackground, // Dark theme background
    card: darkCard, // Dark theme card background
    text: darkText, // Dark theme text color
    border: "#2D2D37", // Dark theme border color
    accent: darkAccent, // Dark theme accent color
    inverted: "#000000", // Black for text on light backgrounds
    white: "#FFFFFF", // Explicitly define white
    black: "#000000", // Explicitly define black
    success: "#28A745", // Success color
    error: "#DC3545", // Error color
    warning: "#FFC107", // Warning color
  },
};

// Apply the theme with custom colors
export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors.light, // Apply light mode colors
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...Colors.dark, // Apply dark mode colors
  },
};


// theme.ts

// colors that are used in both light & dark themes
const error = '#ef4444';
const success = '#10b981';
const p1 = '#0284c7';
const p2 = '#1b90cc';
const p3 = '#349cd2';
const p4 = '#4da8d7';
const p5 = '#67b5dd';
const p6 = '#80c1e3';
const light = '#f2f2f2';
const white = '#fff';
const dark = '#1e2125';
const black = '#000';


// old colors for reference
// export const Colors = {
//   light: {
//     light: light,
//     dark: dark,
//     white: white,
//     black: black,
//     primary: p1,
//     p2: p2,
//     p3: p3,
//     p4: p4,
//     p5: p5,
//     p6: p6,
//     background: light,
//     b2: '#eceff1',
//     b3: '#cfd8dc',
//     b4: '#b0bec5',
//     b5: '#90a4ae',
//     b6: '#78909c',
//     card: '#fff',
//     text: '#222',
//     textmuted: '#6b7280',
//     textinverted: '#fff',
//     error: error,
//     success: success,
//     border: '#d1d5db',
//     inverted: '#121212',
//     notification: 'FF453A',
//     tint: '#0a7ea4',
//     icon: '#687076',
//     tabIconDefault: '#687076',
//     tabIconSelected: '#0a7ea4',
//   },
//   dark: {
//     light: light,
//     dark: dark,
//     white: white,
//     black: black,
//     primary: p1,
//     p2: p2,
//     p3: p3,
//     p4: p4,
//     p5: p5,
//     p6: p6,
//     background: dark,
//     b2: '#23272b',
//     b3: '#292e33',
//     b4: '#575757',
//     b5: '#717171',
//     b6: '#8b8b8b',
//     card: '#171a1d',
//     text: '#fff',
//     textmuted: '#ccc',
//     textinverted: '#222',
//     error: error,
//     success: success,
//     border: '#394148',
//     inverted: '#fff',
//     notification: 'FF453A',
//     tint: '#fff',
//     icon: '#9BA1A6',
//     tabIconDefault: '#9BA1A6',
//     tabIconSelected: '#fff',
//   },
// };

