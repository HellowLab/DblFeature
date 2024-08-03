import React from 'react';
import {Image, View} from 'react-native';

// Import Custom Styles
import { myStyles } from '@/src/utils/constants/styles';

// Import images
import logowhite from '@/src/assets/images/logo/mainlogo_512_white.png'
import logoblack from '@/src/assets/images/logo/mainlogo_512_black.png'

// interface Props {
//   pressed: () => void,
//   text: string,
// }

export const AppLogoLightMode: React.FC = () => {
  return (
    <Image style={myStyles.logo} source={logoblack} />
  )
};

export const AppLogoDarkMode: React.FC = () => {
  return (
    <Image style={myStyles.logo} source={logowhite} />
  )
};


