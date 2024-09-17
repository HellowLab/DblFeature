import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  Animated,
  Appearance,
} from "react-native";
import { useTheme } from "@react-navigation/native";

// Import Custom Components
import MyText from "../TextOutput/TextOutput";
import useThemeStore from "@/src/utils/store/ThemeStore";

// Import Icons
import Icon from "react-native-vector-icons/MaterialIcons";
import { ColorSchemeName } from "@/src/utils/types/types";

// Type definition for the props passed to the BottomSheetModal
type BottomSheetModalProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

/**
 * ThemeBottomSheet component
 * A modal that allows the user to select between light, dark, or system themes.
 *
 * @param {boolean} isVisible - Determines whether the modal is visible.
 * @param {(visible: boolean) => void} setIsVisible - Callback to update modal visibility.
 * @returns {JSX.Element} - A bottom sheet modal with theme options.
 */
const ThemeBottomSheet: React.FC<BottomSheetModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  // Retrieve theme colors from navigation's theme
  const { colors } = useTheme();

  // Access theme and theme update method from the theme store
  const { theme, setTheme } = useThemeStore();

  // Local state to track the currently selected theme
  const [selectedTheme, setSelectedTheme] = useState<ColorSchemeName | null>(
    theme
  );

  // Track the system-wide theme (light/dark) preference
  const [systemTheme, setSystemTheme] = useState(Appearance.getColorScheme());

  // Animation for the card sliding in and out
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Animation for the backdrop opacity
  const opacityAnim = useRef(new Animated.Value(0)).current;

  /**
   * Effect to synchronize the selected theme with the app or system theme.
   * Listens to the system theme changes if "system" is selected.
   */
  useEffect(() => {
    if (theme === "system") {
      const currentSystemTheme = Appearance.getColorScheme();
      setSelectedTheme(currentSystemTheme);
    } else {
      setSelectedTheme(theme);
    }

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
      if (theme === "system") {
        setSelectedTheme(colorScheme);
      }
    });

    return () => subscription.remove();
  }, [theme]);

  /**
   * Effect to trigger animations when modal visibility changes.
   * Slides in the modal and fades in the backdrop when visible.
   */
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  /**
   * Close the modal with animation, then set visibility to false.
   */
  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
    });
  };

  /**
   * Apply the selected theme and update the state.
   * If "system" is selected, also sync with the system's current theme.
   *
   * @param {ColorSchemeName} newTheme - The selected theme option.
   */
  const applyTheme = (newTheme: ColorSchemeName) => {
    setTheme(newTheme);
    if (newTheme === "system") {
      const currentSystemTheme = Appearance.getColorScheme();
      setSelectedTheme(currentSystemTheme);
    } else {
      setSelectedTheme(newTheme);
    }
  };

  /**
   * Helper functions for each theme option button press.
   */
  const handleLightThemePress = () => {
    applyTheme("light");
  };

  const handleDarkThemePress = () => {
    applyTheme("dark");
  };

  const handleSystemThemePress = () => {
    applyTheme("system");
  };

  /**
   * Renders a theme option button with an icon and label.
   *
   * @param {string} label - The label for the theme option.
   * @param {string} iconName - The icon representing the theme option.
   * @param {boolean} isSelected - Whether the option is currently selected.
   * @param {() => void} onPress - The function to call when the button is pressed.
   * @param {boolean} [fullWidth] - Optional flag to make the button full width.
   * @returns {JSX.Element} - A styled button for selecting a theme.
   */
  const ThemeOptionButton = ({
    label,
    iconName,
    isSelected,
    onPress,
    fullWidth,
  }: {
    label: string;
    iconName: string;
    isSelected: boolean;
    onPress: () => void;
    fullWidth?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.themeOptionButton,
        {
          backgroundColor: isSelected ? colors.primary : colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
        },
        fullWidth && styles.themeOptionButtonFullWidth,
      ]}
      onPress={onPress}
    >
      <Icon
        name={iconName}
        size={24}
        color={isSelected ? colors.inverted : colors.text}
        style={styles.themeOptionIcon}
      />
      <MyText
        style={{
          color: isSelected ? colors.inverted : colors.text,
          fontWeight: isSelected ? "bold" : "normal",
        }}
      >
        {label}
      </MyText>
    </TouchableOpacity>
  );

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={closeModal}>
      {/* Animated backdrop */}
      <TouchableWithoutFeedback onPress={closeModal}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
      </TouchableWithoutFeedback>

      {/* Animated bottom sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: colors.background, // Main background color
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0], // Slide from bottom
                }),
              },
            ],
          },
        ]}
      >
        {/* Modal header with draggable handle */}
        <View style={styles.sheetHeader}>
          <View
            style={[
              styles.sheetHandle,
              { backgroundColor: colors.primary }, // Contrast color for handle
            ]}
          />
        </View>

        {/* Light and Dark theme options */}
        <View style={styles.themeOptionsContainer}>
          <ThemeOptionButton
            label="Light"
            iconName="wb-sunny"
            isSelected={selectedTheme === "light"}
            onPress={handleLightThemePress}
          />
          <ThemeOptionButton
            label="Dark"
            iconName="nightlight-round"
            isSelected={selectedTheme === "dark"}
            onPress={handleDarkThemePress}
          />
        </View>

        {/* Separator */}
        <View
          style={[styles.separator, { backgroundColor: colors.primary }]} // Use contrast color
        />

        {/* System theme option */}
        <ThemeOptionButton
          label="Use System Theme"
          iconName="settings"
          isSelected={theme === "system"}
          onPress={handleSystemThemePress}
          fullWidth={true}
        />
      </Animated.View>
    </Modal>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 20,
  },
  sheetHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  themeOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  themeOptionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
  },
  themeOptionButtonFullWidth: {
    flex: 1,
    marginHorizontal: 0,
    marginBottom: 10,
  },
  themeOptionIcon: {
    marginRight: 8,
  },
  separator: {
    height: 1,
    marginVertical: 10,
  },
});

export default ThemeBottomSheet;
