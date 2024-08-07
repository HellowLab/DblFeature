import React from 'react';
import {Image, View} from 'react-native';
import useThemeStore from '@/src/utils/store/ThemeStore';

// Import Custom Styles
import { myStyles } from '@/src/utils/constants/styles';

// Import images
import logowhite from '@/src/assets/images/logo/mainlogo_512_white.png'
import logoblack from '@/src/assets/images/logo/mainlogo_512_black.png'

// interface Props {
//   pressed: () => void,
//   text: string,
// }

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

export const AppLogo: React.FC = () => {
  const { theme } = useThemeStore();

  return (
    <View>
      {theme === 'dark' ? (<AppLogoDarkMode/>) : (<AppLogoLightMode/>)}
    </View>
  )
}