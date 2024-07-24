import React from "react";
import { Image } from "react-native";

// Import custom styles
import { myStyles } from "@/src/utils/constants/styles";

// Import images
// @ts-ignore
import logowhite from "@/src/assets/images/logo/mainlogo_512_white.png";
// @ts-ignore
import logoblack from "@/src/assets/images/logo/mainlogo_512_black.png";

/**
 * A functional component that renders the application logo in light mode.
 *
 * @returns {JSX.Element} - The rendered light mode logo.
 */
export const AppLogoLightMode: React.FC = () => {
  return <Image style={myStyles.logo} source={logoblack} />;
};

/**
 * A functional component that renders the application logo in dark mode.
 *
 * @returns {JSX.Element} - The rendered dark mode logo.
 */
export const AppLogoDarkMode: React.FC = () => {
  return <Image style={myStyles.logo} source={logowhite} />;
};
