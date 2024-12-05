import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native"; // Import TouchableOpacity for navigation
import { useRouter } from "expo-router"; // Import useRouter for navigation
import FlashMessage from "react-native-flash-message";
import ProfilePicture from "@/src/components/images/ProfilePicture";

/**
 * Stack2Layout component renders a tab-based layout with customized
 * appearance and gesture handling, integrating React Navigation's
 * DrawerToggleButton and MaterialIcons.
 *
 * @returns {JSX.Element} - The main layout with tab navigation and header configuration.
 */
export default function Stack2Layout() {
  const { colors } = useTheme(); // Access theme colors from navigation
  const router = useRouter(); // Router for navigating to the AccountSettings screen

  return (
    // GestureHandlerRootView is used to wrap the layout and handle gestures properly
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false, // Hide labels under tab icons
          tabBarStyle: {
            backgroundColor: colors.card, // Set tab bar background to accent color
            borderTopWidth: 0, // Remove border from the top of the tab bar
            height: 60, // Set tab bar height
          },
          tabBarActiveTintColor: colors.text, // Set active tab icon color to primary theme color
          tabBarInactiveTintColor: colors.accent, // Set inactive tab icon color to text color
          tabBarItemStyle: {
            justifyContent: "center", // Center icons vertically
            alignItems: "center", // Center icons horizontally
            paddingTop: 8, // Add top padding to tab items
          },
          headerStyle: { backgroundColor: colors.primary }, // Set header background color
          headerTintColor: colors.white, // Set header text color to inverted theme color
          headerTitleStyle: { fontWeight: "bold" }, // Set header title font to bold

          // Left side of the header contains a DrawerToggleButton
          headerLeft: (props) => (
            <DrawerToggleButton {...props} tintColor={colors.white} /> // Set drawer toggle button color
          ),

          // Right side of the header contains a user icon with padding
          headerRight: () => (
            <View style={{ paddingRight: 12 }}>
              <ProfilePicture
                size={40}
                onPress={() => router.push("/(accountsettings)")}
              />
            </View>
          ),
        }}
      >
        {/* Home Tab */}
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home", // Tab title
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} /> // Icon for Home tab
            ),
          }}
        />

        {/* Search Tab */}
        <Tabs.Screen
          name="(search)"
          options={{
            title: "Search", // Tab title
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" color={color} size={size} /> // Icon for Search tab
            ),
          }}
        />

        {/* My Movies Tab */}
        <Tabs.Screen
          name="(mymovies)"
          options={{
            title: "My Movies", // Tab title
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="film" color={color} size={size} /> // Icon for My Movies tab
            ),
          }}
        />
      </Tabs>
      <FlashMessage position="bottom" />
    </GestureHandlerRootView>
  );
}
