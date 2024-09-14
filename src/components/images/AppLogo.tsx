// AppLogo.js
import React from "react";
import { Image, View } from "react-native";

// Import custom styles
import { myStyles } from "@/src/utils/constants/styles";

// Import images for dark and light themes
// @ts-ignore
import logowhite from "@/src/assets/images/logo/mainlogo_512_white.png";
// @ts-ignore
import logoblack from "@/src/assets/images/logo/mainlogo_512_black.png";

// Import useThemeStore to get the current theme
import useThemeStore from "@/src/utils/store/ThemeStore";

/**
 * Functional component that renders the app logo for light mode.
 * Displays a black logo.
 *
 * @returns {JSX.Element} The logo image for light mode.
 */
export const AppLogoLightMode: React.FC = () => {
  return <Image style={myStyles.logo} source={logoblack} />;
};

/**
 * Functional component that renders the app logo for dark mode.
 * Displays a white logo.
 *
 * @returns {JSX.Element} The logo image for dark mode.
 */
export const AppLogoDarkMode: React.FC = () => {
  return <Image style={myStyles.logo} source={logowhite} />;
};

/**
 * A functional component that renders the appropriate application logo
 * based on the current theme (dark or light) from the theme store.
 *
 * @returns {JSX.Element} The rendered logo based on the active theme.
 */
export const AppLogo: React.FC = () => {
  const { theme } = useThemeStore(); // Get the app's theme from the store

  // Render the logo based on the current theme
  return (
    <View>{theme === "dark" ? <AppLogoDarkMode /> : <AppLogoLightMode />}</View>
  );
};
