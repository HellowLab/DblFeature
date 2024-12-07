import React from "react";
import { View } from "react-native";
import { styles } from "./index.styles";
import UserDetailsScreen from "@/src/screens/AccountSettingsScreen/UserDetailsScreen";

const App = () => {
  return (
    <View style={styles.pageContainer}>
      <UserDetailsScreen />
    </View>
  );
};

export default App;
