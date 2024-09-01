import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@react-navigation/native";

// Import Custom Components
import MyButton from "../Buttons/Button";
import MyText from "../TextOutput/TextOutput";
import useThemeStore from "@/src/utils/store/ThemeStore";

type BottomSheetModalProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

const ThemeBottomSheet: React.FC<BottomSheetModalProps> = ({ isVisible, setIsVisible }) => {
  const { colors } = useTheme();
  const { setTheme } = useThemeStore();

  const closeModal = () => {
    setIsVisible(false);
  };

  const handleLightThemePress = () => {
    // Set light theme using zustand store
    setTheme("light");
    closeModal();
  }

  const handleDarkThemePress = () => {
    // Set dark theme using zustand store
    setTheme("dark");
    closeModal();
  }

  const handleSystemThemePress = () => {
    // Set system theme using zustand store
    setTheme("system");
    closeModal();
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >
        {/* Shaded background */}
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Bottom sheet modal */}
        <View style={[styles.bottomSheet, { backgroundColor: colors.card }]}>
          <View style={{paddingBottom: 20}}>
            <MyText size="large" bold>Select Your Theme</MyText>
          </View>
          <MyButton width="full" onPress={handleLightThemePress}>
            Always Light Theme
          </MyButton>
          <MyButton width="full" onPress={handleDarkThemePress}>
            Always Dark Theme
          </MyButton>
          <MyButton width="full" onPress={handleSystemThemePress}>
            Use System Theme
          </MyButton>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  bottomSheet: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    gap: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ThemeBottomSheet;
