import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import React from 'react';
import sv, { VariantProps } from 'style-variants';
import { useTheme } from '@react-navigation/native';

type ButtonVariantsProps = {
  color?: "primary" | "card" | "error";
  width?: "full" | "nearfull" | "auto" | "small" | "medium" | "large";
  height?: "small" | "medium" | "large" | "xlarge";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  rounded?: "none" | "small" | "medium" | "large" | "full";
  textsize?: "small" | "medium" | "large" | "xlarge" | "xxlarge";
  textcolor?: "primary" | "white" | "black" | "error";
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
  rounded,
  ...props
}: ButtonProps) => {

  const { colors } = useTheme();
    
  const button = sv({
    base: {
      alignItems: 'center',
      justifyContent: 'center', 
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
          height: 40,
          fontSize: 16,
        },
        medium: {
          height: 48,
          fontSize: 20,
        },
        large: {
          height: 56,
        },
        xlarge: {
          height: 64,
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
          backgroundColor: colors.error,
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
        none: {
          borderRadius: 0,
        },
        small: {
          borderRadius: 3,
        },
        medium: {
          borderRadius: 6,
        },
        large: {
          borderRadius: 12,
        },
        full: {
          borderRadius: 9999,
        },
      },
    },
    defaultVariants: {
      width: 'medium',
      height: 'medium',
      color: 'primary',
      disabled: false,
      rounded: 'small',
    },
  });

  const text = sv({
    base: {
      // fontWeight: '500',
    },
    variants: {
      textsize: {
        small: {
          fontSize: 16,
        },
        medium: {
          fontSize: 18,
        },
        large: {
          fontSize: 20,
        },
        xlarge: {
          fontSize: 22,
        },
        xxlarge: {
          fontSize: 24,
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
          color: colors.error,
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
    rounded,
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