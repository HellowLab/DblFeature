import React from "react";
import { View } from "react-native";
import movies from "../src/assets/data/users";
import AnimatedStack from "@/src/components/AnimatedStack";
import { onSwipeLeft, onSwipeRight } from "@/src/utils/callbacks";
import { styles } from "./index.styles";

/**
 * Main application component that displays movie cards with pan gestures.
 *
 * @returns {JSX.Element} The rendered component.
 */
const App = () => {
  return (
    <View style={styles.pageContainer}>
      <AnimatedStack
        data={movies}
        onSwipeRight={onSwipeRight}
        onSwipeLeft={onSwipeLeft}
      />
    </View>
  );
};

export default App;
