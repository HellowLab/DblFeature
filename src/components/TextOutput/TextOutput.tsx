// TextOutput.tsx
import React, {useState} from 'react';
import { View, Text, TextProps } from 'react-native';
import { useTheme } from '@react-navigation/native';
import sv from 'style-variants';
import {Svg, Path } from 'react-native-svg'

import { BORDERRADIUS } from '@/src/utils/constants';


type TextVariantsProps = {
  color?: 'normal' | 'error' | 'inverted';
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  // width?: 'full' | "nearfull" | 'auto' | 'small' | 'medium' | 'large';
  // height?: 'small' | 'medium' | 'large' | 'xlarge';
  // intent?: 'normal' | 'password'
}

type MyTextProps = TextVariantsProps & TextProps;


const MyText: React.FC<MyTextProps> = ({ color, size, children, ...props }) => {
  const { colors } = useTheme();

  const textsv = sv({
    base: {
      // borderRadius: BORDERRADIUS,
      // borderWidth: 1,
      // borderColor: colors.border,
      // color: colors.text,
      // paddingHorizontal: 10
    },
    variants: {
      color: {
        normal: {
          color: colors.text,
        },
        error: {
          color: colors.error
        },
        inverted: {
          color: colors.inverted
        }
      },
      size: {
        xsmall: {
          fontSize: 10,
        },
        small: {
          fontSize: 12,
        },
        medium: {
          fontSize: 14,
        },
        large: {
          fontSize: 16,
        },
        xlarge: {
          fontSize: 18,
        }
      }
    },
    defaultVariants: {
      color: 'normal',
      size: 'medium',
    },
  });

  const textInputStyles = textsv({
    color,
    size
  });

  return (
      <Text style={textInputStyles} {...props} >
        {children}
      </Text>
  );
};

export default MyText;
