import React from "react";
import { View } from "react-native";
import movies from "../src/assets/data/users";
import AnimatedStack from "@/src/components/AnimatedStack";
import { styles } from "./index.styles";

/**
 * Main application component that displays movie cards with pan gestures.
 *
 * @returns {JSX.Element} The rendered component.
 */
const App = () => {
  return (
    <View style={styles.pageContainer}>
      <AnimatedStack data={movies} />
    </View>
  );
};

export default App;
