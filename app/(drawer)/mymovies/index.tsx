import React from "react";
import { View } from "react-native";
import HomeScreen from "@/src/screens/HomeScreen";
import MatchesScreen from "@/src/screens/MatchesScreen";
import Button from "@/src/components/Buttons/Button";
/**
 * Main application component that displays movie cards with pan gestures.
 *
 * @returns {JSX.Element} The rendered component.
 */
const MyMovies = () => {
  return (
    <View>
      <HomeScreen />
    </View>
  );
};

export default MyMovies;
