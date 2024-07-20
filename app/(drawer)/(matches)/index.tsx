import React from "react";
import { View } from "react-native";
// import { styles } from "./index.styles";
import MatchesScreen from "@/src/screens/MatchesScreen";

/**
 * Main application component that displays movie cards with pan gestures.
 *
 * @returns {JSX.Element} The rendered component.
 */
const App = () => {
  return (
    <View style={{
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    }}>
      <MatchesScreen />
    </View>
  );
};

export default App;
