import { Stack } from "expo-router";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AccountSettingsLayout() {
  const { colors } = useTheme(); // Access theme colors
  const router = useRouter(); // For navigation control

  return (
    <Stack
      screenOptions={{
        title: "Account Settings",
        headerStyle: {
          backgroundColor: colors.primary, // Use theme primary color for background
        },
        headerTintColor: colors.white, // Set header text/icon color to white
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingLeft: 12 }}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.white} // Use white for the back button color
            />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
