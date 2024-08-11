import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
// import 'react-native-reanimated';

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

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../src/assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  // const customDarkTheme = { ...DarkTheme, colors:Colors.dark}
  // const customLightTheme = { ...DefaultTheme, colors:Colors.light}

  // Set the theme to the current device theme
  // TODO: Update this to pull the theme from storage, once we add that feature. For now it resets when the app is launched
  // const [theme, setTheme] = useState(systemScheme)
  const { theme } = useThemeStore();

  return (
    <ThemeProvider value={theme === "dark" ? darkTheme : lightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(login)" />
        <Stack.Screen name="(drawer)" />
      </Stack>
    </ThemeProvider>
  );
}
