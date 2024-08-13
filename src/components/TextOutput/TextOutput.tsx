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
  align?: 'left' | 'center' | 'right';
  // width?: 'full' | "nearfull" | 'auto' | 'small' | 'medium' | 'large';
  // height?: 'small' | 'medium' | 'large' | 'xlarge';
  // intent?: 'normal' | 'password'
}

type MyTextProps = TextVariantsProps & TextProps;

/**
 * MyText Component
 * 
 * This component renders text with customizable properties such as color, size, and alignment.
 * It uses the theme colors from the context.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.color] - The color of the text.
 * @param {'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'} [props.size] - The size of the text.
 * @param {'left' | 'center' | 'right'} [props.align] - The alignment of the text.
 * @param {React.ReactNode} props.children - The content to be displayed inside the text component.
 * 
 * @returns {JSX.Element} The rendered text component.
 */
const MyText: React.FC<MyTextProps> = ({ color, size, children, align, ...props }) => {
  const { colors } = useTheme();

  const textsv = sv({
    base: {
      // textAlign: 'center',
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
      },
      align: {
        left: {
          textAlign: 'left'
        },
        center: {
          textAlign: 'center'
        },
        right: {
          textAlign: 'right'
        }
      }
    },
    defaultVariants: {
      color: 'normal',
      size: 'medium',
      align: 'left'
    },
  });

  const textInputStyles = textsv({
    color,
    size,
    align,
  });

  return (
      <Text style={textInputStyles} {...props} >
        {children}
      </Text>
  );
};

export default MyText;
