import { Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";
import React from "react";

export default function HomeLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen options={{ title: "Search" }} name="index" />
      {/* <Stack.Screen options={{title:"Details"}} name="details" /> */}
    </Stack>
  );
}
