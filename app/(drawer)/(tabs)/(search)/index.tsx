import React from "react";
import { View } from "react-native";
import SearchScreen from "@/src/screens/SearchScreen";

/**
 * Main application component that displays movie cards with pan gestures.
 *
 * @returns {JSX.Element} The rendered component.
 */
const App = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <SearchScreen />
    </View>
  );
};

export default App;
