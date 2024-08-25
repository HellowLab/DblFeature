import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

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

  // set theme from zustand store
  const { theme } = useThemeStore();
  const colorScheme = useColorScheme();
  const [myTheme, setMyTheme] = useState('light');

  //useEffect that sets the theme based on the colorScheme
  useEffect(() => {
    if (theme === "light" || theme === "dark") {
      console.log("setting theme manually to: ", theme);
      setMyTheme(theme);
    }
    else {
      if (colorScheme === "light" || colorScheme === "dark") {
        console.log("setting theme to colorScheme: ", colorScheme);
        setMyTheme(colorScheme);
      }
    }
    
  }, [theme, colorScheme]);


  
  return (
    <ThemeProvider value={myTheme === "dark" ? darkTheme : lightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(login)" />
        <Stack.Screen name="(drawer)" />
      </Stack>
    </ThemeProvider>
  );
}
