import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

// Import zustand store
import useThemeStore from "@/src/utils/store/ThemeStore";

// Import themes
import { lightTheme, darkTheme } from "@/src/utils/theme/theme";
import React from "react";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * RootLayout component handles the app's initialization, including loading fonts,
 * managing the splash screen, and rendering the navigation tree.
 *
 * @returns {JSX.Element|null} - Returns the RootLayoutNav component when fonts are loaded, otherwise returns null.
 */
export default function RootLayout() {
  // Load custom fonts including FontAwesome icons
  const [loaded, error] = useFonts({
    SpaceMono: require("../src/assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Handle font loading errors
  useEffect(() => {
    if (error) throw error; // Throw error if font loading fails
  }, [error]);

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Return null until fonts are loaded
  if (!loaded) {
    return null;
  }

  // Render the main navigation layout
  return <RootLayoutNav />;
}

/**
 * RootLayoutNav component manages the theme based on Zustand store and device color scheme.
 *
 * @returns {JSX.Element} - The navigation structure wrapped with ThemeProvider.
 */
function RootLayoutNav() {
  // Retrieve theme from zustand store
  const { theme } = useThemeStore();
  const colorScheme = useColorScheme(); // Detect system color scheme
  const [myTheme, setMyTheme] = useState("light"); // Default theme is light

  // Update theme based on zustand store or system color scheme
  useEffect(() => {
    if (theme === "light" || theme === "dark") {
      console.log("Setting theme manually to:", theme);
      setMyTheme(theme); // Set theme from zustand store
    } else if (colorScheme === "light" || colorScheme === "dark") {
      console.log("Setting theme to system color scheme:", colorScheme);
      setMyTheme(colorScheme); // Set theme from system settings
    }
  }, [theme, colorScheme]); // Re-run effect when theme or colorScheme changes

  // Apply theme and configure navigation stack
  return (
    <ThemeProvider value={myTheme === "dark" ? darkTheme : lightTheme}>
      {/* Stack Navigator without headers */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Define screen routes */}
        <Stack.Screen name="(login)" />
        <Stack.Screen name="(drawer)" />
      </Stack>
    </ThemeProvider>
  );
}
