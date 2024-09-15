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
import MyButton from "../Buttons/Button";
import MyText from "../TextOutput/TextOutput";
import useThemeStore from "@/src/utils/store/ThemeStore";

// Import Icons
import Icon from "react-native-vector-icons/MaterialIcons";
import { ColorSchemeName } from "@/src/utils/types/types";

// Type definition for the props passed to the BottomSheetModal
type BottomSheetModalProps = {
  isVisible: boolean; // Controls modal visibility
  setIsVisible: (visible: boolean) => void; // Function to toggle modal visibility
};

/**
 * ThemeBottomSheet component
 * A modal that allows the user to select between light, dark, or system themes.
 *
 * @param {boolean} isVisible - Determines whether the modal is visible.
 * @param {(visible: boolean) => void} setIsVisible - Callback to update modal visibility.
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

  // Animation for the card
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Animation for the backdrop
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Effect to update selected theme based on changes in the current theme or system settings
  useEffect(() => {
    if (theme === "system") {
      // Set to system theme if the user's preference is set to 'system'
      const currentSystemTheme = Appearance.getColorScheme();
      setSelectedTheme(currentSystemTheme);
    } else {
      // Otherwise, set to the selected theme (light/dark)
      setSelectedTheme(theme);
    }

    // Add listener for system theme changes and update accordingly
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
      if (theme === "system") {
        setSelectedTheme(colorScheme);
      }
    });

    // Clean up the listener when the component unmounts
    return () => subscription.remove();
  }, [theme]);

  // Animate when modal visibility changes
  useEffect(() => {
    if (isVisible) {
      // Start animations when modal becomes visible
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1, // Slide card up
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1, // Fade in backdrop
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reverse animations when modal hides
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0, // Slide card down
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0, // Fade out backdrop
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  // Function to close the modal
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
      setIsVisible(false); // Only hide the modal after animation completes
    });
  };

  // Function to apply a new theme
  const applyTheme = (newTheme: ColorSchemeName) => {
    setTheme(newTheme); // Update the global theme state
    if (newTheme === "system") {
      const currentSystemTheme = Appearance.getColorScheme();
      setSelectedTheme(currentSystemTheme); // Use the current system theme if 'system' is selected
    } else {
      setSelectedTheme(newTheme); // Otherwise, use the selected theme (light/dark)
    }
  };

  // Handlers for each theme option
  const handleLightThemePress = () => {
    applyTheme("light");
  };

  const handleDarkThemePress = () => {
    applyTheme("dark");
  };

  const handleSystemThemePress = () => {
    applyTheme("system");
  };

  // Type definition for the ThemeOptionButton props
  type ThemeOptionButtonProps = {
    label: string; // Text label for the button
    iconName: string; // Icon name for the button
    isSelected: boolean; // Indicates if this button's option is selected
    onPress: () => void; // Function to handle button press
    fullWidth?: boolean; // Optional: Whether the button takes up full width
  };

  /**
   * ThemeOptionButton component
   * A reusable button to display theme options (light, dark, system).
   *
   * @param {string} label - The label displayed on the button.
   * @param {string} iconName - The name of the icon to be displayed.
   * @param {boolean} isSelected - Indicates if this option is currently selected.
   * @param {() => void} onPress - Callback to be invoked when the button is pressed.
   * @param {boolean} [fullWidth] - Optional prop to make the button span the full width.
   */
  const ThemeOptionButton: React.FC<ThemeOptionButtonProps> = ({
    label,
    iconName,
    isSelected,
    onPress,
    fullWidth,
  }) => (
    <TouchableOpacity
      style={[
        styles.themeOptionButton,
        isSelected && styles.themeOptionButtonSelected, // Highlight if selected
        fullWidth && styles.themeOptionButtonFullWidth, // Apply full width style if passed
      ]}
      onPress={onPress}
    >
      {/* Icon representing the theme option */}
      <Icon
        name={iconName}
        size={24}
        color={isSelected ? "#fff" : "#000"} // Change icon color based on selection
        style={styles.themeOptionIcon}
      />
      {/* Label for the theme option */}
      <MyText
        style={[
          styles.themeOptionText,
          isSelected && styles.themeOptionTextSelected, // Highlight text if selected
        ]}
      >
        {label}
      </MyText>
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal} // Close modal when back button is pressed
    >
      {/* Animated backdrop */}
      <TouchableWithoutFeedback onPress={closeModal}>
        <Animated.View
          style={[styles.backdrop, { opacity: opacityAnim }]} // Fade the backdrop
        />
      </TouchableWithoutFeedback>

      {/* Animated bottom sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: colors.card,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0], // Adjust the slide-up motion
                }),
              },
            ],
          },
        ]}
      >
        {/* Modal header with draggable handle */}
        <View style={styles.sheetHeader}>
          <View style={styles.sheetHandle} />
        </View>

        {/* Light and Dark theme options */}
        <View style={styles.themeOptionsContainer}>
          <ThemeOptionButton
            label="Light"
            iconName="wb-sunny"
            isSelected={selectedTheme === "light"} // Highlight if light theme is selected
            onPress={handleLightThemePress}
          />
          <ThemeOptionButton
            label="Dark"
            iconName="nightlight-round"
            isSelected={selectedTheme === "dark"} // Highlight if dark theme is selected
            onPress={handleDarkThemePress}
          />
        </View>

        {/* Separator between theme options and system theme */}
        <View style={styles.separator} />

        {/* System theme option */}
        <ThemeOptionButton
          label="Use System Theme"
          iconName="settings"
          isSelected={theme === "system"} // Highlight if system theme is selected
          onPress={handleSystemThemePress}
          fullWidth={true} // Full-width button
        />
      </Animated.View>
    </Modal>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 20, // Android shadow
  },
  sheetHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc", // Draggable handle
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
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
  },
  themeOptionButtonSelected: {
    borderColor: "#007BFF", // Blue highlight for selected option
    backgroundColor: "#007BFF",
  },
  themeOptionButtonFullWidth: {
    flex: 1,
    marginHorizontal: 0,
    marginBottom: 10,
  },
  themeOptionIcon: {
    marginRight: 8,
  },
  themeOptionText: {
    fontSize: 16,
    color: "#000", // Default text color
  },
  themeOptionTextSelected: {
    color: "#fff", // White text for selected option
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
});

export default ThemeBottomSheet;
