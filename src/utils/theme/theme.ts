import { DefaultTheme, DarkTheme } from "@react-navigation/native";

// Updated Blues for Light Mode
const lightAccent = "#4F7FB3"; // Slightly darker blue for actions
const lightBackground = "#C2D4E6"; // Darker blue for background
const lightCard = "#94B5D1"; // Slightly darker blue for cards
const lightText = "#223C54"; // Darker blue text for readability
const lightPrimary = "#6A99C2"; // More pronounced blue for primary actions

// Dark Mode (Unchanged)
const darkAccent = "#1A355A"; // Deep blue for actions in dark mode
const darkBackground = "#0A1C30"; // Darkest blue background for dark mode
const darkCard = "#142843"; // Slightly lighter blue for cards
const darkText = "#DDEAF6"; // Light blue text for dark mode
const darkPrimary = "#3769A3"; // Bright blue for accents in dark mode

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
