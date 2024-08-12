import React from "react";
import { View } from "react-native";

import MyMoviesScreen from "@/src/screens/MyMoviesScreen";

/**
 * Main application component that displays movie cards with pan gestures.
 *
 * @returns {JSX.Element} The rendered component.
 */
const App = () => {
  return <MyMoviesScreen />;
};

export default App;
