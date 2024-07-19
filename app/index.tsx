import React from "react";
import { View } from "react-native";
import { styles } from "./index.styles";
import HomeScreen from "@/src/screens/HomeScreen";
import MatchesScreen from "@/src/screens/MatchesScreen";
import SearchScreen from "@/src/screens/SearchScreen";

/**
 * Main application component that displays movie cards with pan gestures.
 *
 * @returns {JSX.Element} The rendered component.
 */
const App = () => {
  return (
    <View style={styles.pageContainer}>
      <HomeScreen />
    </View>
  );
};

export default App;
