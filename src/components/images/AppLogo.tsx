
import React from 'react';
import {Image, View} from 'react-native';
import { useTheme } from '@react-navigation/native';

// Import custom styles
import { myStyles } from "@/src/utils/constants/styles";

// Import images
// @ts-ignore
import logowhite from "@/src/assets/images/logo/mainlogo_512_white.png";
// @ts-ignore
import logoblack from "@/src/assets/images/logo/mainlogo_512_black.png";


const AppLogoLightMode: React.FC = () => {
  return (
    <Image style={myStyles.logo} source={logoblack} />
  )
};

const AppLogoDarkMode: React.FC = () => {
  return (
    <Image style={myStyles.logo} source={logowhite} />
  )
};
/**
 * A functional component that renders the application logo in light / dark mode.
 *
 * @returns {JSX.Element} - The rendered light mode logo.
 */
export const AppLogo: React.FC = () => {
  const { dark  } = useTheme();

  return (
    <View>
      {dark === true ? (<AppLogoDarkMode/>) : (<AppLogoLightMode/>)}
    </View>
  )
}
