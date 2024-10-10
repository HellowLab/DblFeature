import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import React from 'react';
import sv, { VariantProps } from 'style-variants';
import { useTheme } from '@react-navigation/native';

type ButtonVariantsProps = {
  color?: 'primary' | 'card' | 'error';
  width?: 'full' | "nearfull" | 'auto' | 'small' | 'medium' | 'large';
  height?: 'small' | 'medium' | 'large' | 'xlarge';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  rounded?: boolean;
  textsize?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
  textcolor?: 'primary' | 'white' | 'black' | 'error';
};


type ButtonProps = ButtonVariantsProps &
  TouchableOpacityProps & {
    children: string,
  };

const MyButton = ({
  style,
  children,
  color, 
  width, 
  height,
  disabled,
  textsize,
  textcolor,
  ...props
}: ButtonProps) => {

  const { colors } = useTheme();
    
  const button = sv({
    base: {
      // borderWidth: 2,
      // borderColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      // borderRadius: 3,
      // paddingVertical: 8,
      // height: 40,
      
    },
    variants: {
      width: {
        full: {
          width: '100%',
        },
        nearfull: {
          width: '95%',
        },
        auto: {
          width: 'auto',
        },
        small: {
          width: 180,
        },
        medium: {
          width: 240,
        },
        large: {
          width: 300,
        },
      },
      height: {
        small: {
          height: 32,
        },
        medium: {
          height: 40,
        },
        large: {
          height: 48,
        },
        xlarge: {
          height: 56,
        },
      },
      color: {
        primary: {
          backgroundColor: colors.primary,
        },
        card: {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        },
        error: {
          backgroundColor: colors.notification,
          borderColor: 'lightpink',
          borderWidth:1,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
      rounded: {
        true: {
          borderRadius: 3,
        },
        false: {
          borderRadius: 0,
        },
      },
    },
    defaultVariants: {
      width: 'medium',
      height: 'medium',
      color: 'primary',
      disabled: false,
      rounded: true,
    },
  });

  const text = sv({
    base: {
      // fontWeight: '500',
    },
    variants: {
      textsize: {
        small: {
          fontSize: 14,
        },
        medium: {
          fontSize: 16,
        },
        large: {
          fontSize: 18,
        },
        xlarge: {
          fontSize: 20,
        },
        xxlarge: {
          fontSize: 22,
        }, 
      },
      textcolor: {
        primary: {
          color: colors.text,
        },
        white: {
          color: colors.white
        },
        black: {
          color: colors.black
        },
        error: {
          color: colors.notification,
        },
      },
    },
    defaultVariants: {
      textsize: 'medium',
      textcolor: 'white',
    },
  });

  const textStyles = text({ textsize, textcolor });
  const buttonStyles = button({
    width, 
    height,
    color,
    disabled,
  });

  return (
    <TouchableOpacity
      style={buttonStyles}
      activeOpacity={0.5}
      disabled={disabled}
      {...props}
    >
      <Text style={textStyles}>{children}</Text>
    </TouchableOpacity>
  );
};

export default MyButton;