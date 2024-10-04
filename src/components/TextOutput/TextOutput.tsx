import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "@react-navigation/native";
import sv from "style-variants";

import { BORDERRADIUS } from "@/src/utils/constants";

// Define type for text variants
type TextVariantsProps = {
  color?: "normal" | "error" | "inverted" | "primary" | "white" | "black";
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
  align?: "left" | "center" | "right";
  bold?: boolean;
};

type MyTextProps = TextVariantsProps & TextProps;

/**
 * MyText Component
 *
 * This component renders customizable text with support for multiple properties
 * such as color, size, alignment, and font weight. It integrates with the theme
 * provided by `react-navigation` to apply theme-based colors.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The text content to render.
 * @param {'normal' | 'error' | 'inverted' | 'primary' | 'white' | 'black'} [props.color] - Color variant of the text.
 * @param {'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'} [props.size] - Size variant of the text.
 * @param {'left' | 'center' | 'right'} [props.align] - Text alignment (left, center, right).
 * @param {boolean} [props.bold] - Whether the text should be bold.
 *
 * @returns {JSX.Element} - The rendered text component with applied styles.
 */
const MyText: React.FC<MyTextProps> = ({
  color,
  size,
  align,
  bold,
  children,
  ...props
}) => {
  // Get theme colors from the navigation context
  const { colors } = useTheme();

  // Style variants configuration
  const textsv = sv({
    base: {
      // Define any base styles for the text component
    },
    variants: {
      color: {
        normal: {
          color: colors.text, // Default theme text color
        },
        error: {
          color: colors.error, // Error color from theme
        },
        inverted: {
          color: colors.inverted, // Inverted theme color
        },
        primary: {
          color: colors.primary, // Primary theme color
        },
        white: {
          color: colors.white, // White color
        },
        black: {
          color: colors.black, // Black color
        },
      },
      size: {
        xsmall: {
          fontSize: 8, // Extra small font size
        },
        small: {
          fontSize: 12, // Small font size
        },
        medium: {
          fontSize: 14, // Medium font size (default)
        },
        large: {
          fontSize: 18, // Large font size
        },
        xlarge: {
          fontSize: 22, // Extra large font size
        },
        xxlarge: {
          fontSize: 26, // Double extra large font size
        },
      },
      align: {
        left: {
          textAlign: "left", // Align text to the left
        },
        center: {
          textAlign: "center", // Center-aligned text
        },
        right: {
          textAlign: "right", // Align text to the right
        },
      },
      bold: {
        true: {
          fontWeight: "bold", // Apply bold font weight
        },
      },
    },
    defaultVariants: {
      color: "normal", // Default color
      size: "medium", // Default size
      align: "left", // Default text alignment
    },
  });

  // Apply styles based on the provided props
  const textInputStyles = textsv({
    color,
    size,
    align,
    bold,
  });

  return (
    <Text style={textInputStyles} {...props}>
      {children}
    </Text>
  );
};

export default MyText;
