import React from "react";
import { View } from "react-native";
import { styles } from "./index.styles";
import AccountSettingsScreen from "@/src/screens/AccountSettingsScreen";

/**
 * Main application component that displays movie cards with pan gestures.
 *
 * @returns {JSX.Element} The rendered component.
 */
const App = () => {
  return (
    <View style={styles.pageContainer}>
      <AccountSettingsScreen />
    </View>
  );
};

export default App;
