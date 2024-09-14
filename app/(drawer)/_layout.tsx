import React, { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { View, Text, Appearance, ColorSchemeName } from "react-native"; // Import ColorSchemeName
import { useRouter } from "expo-router";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AppLogo } from "@/src/components/images/AppLogo";
import { myStyles } from "@/src/utils/constants/styles";
import appConfig from "@/appConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./drawer.styles";
import MyText from "@/src/components/TextOutput/TextOutput";

import { createMovieResult } from "@/src/utils/APIs/api";
import ThemeBottomsheet from "@/src/components/Modals/ThemeBottomSheet";
import useThemeStore from "@/src/utils/store/ThemeStore";

/**
 * Layout component responsible for rendering the app's main navigation drawer.
 * This includes multiple screens such as Home, My Movies, My Matches, Search, and a Tab Navigator.
 * The layout component is wrapped in a GestureHandlerRootView to ensure proper gesture support.
 *
 * @returns {JSX.Element} The root view with gesture handling enabled and a configured drawer component.
 */
export default function Layout() {
  return (
    // GestureHandlerRootView is required to enable gesture handling in the app
    // Flex 1 ensures that the component takes up the full height of its parent
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        // Custom drawer content defined by CustomDrawerContent component
        drawerContent={(props) => {
          return <CustomDrawerContent {...props} />;
        }}
        // Screen options with header hidden
        screenOptions={{ headerShown: false }}
      >
        {/* The drawer screen for the tab navigator */}
        <Drawer.Screen name="(tabs)" options={{ title: "Home" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

/**
 * CustomDrawerContent component renders the custom content inside the navigation drawer.
 * This includes the app logo, welcome message, navigation items, theme selection, and logout button.
 *
 * @param {object} props - The properties passed from the Drawer component, including navigation controls.
 * @returns {JSX.Element} The custom drawer UI with app navigation and user actions.
 */
function CustomDrawerContent(props: any) {
  const [bottomSheetIsVisible, setBottomSheetIsVisible] = useState(false); // State to control the visibility of the theme selection modal
  const router = useRouter(); // Hook to control app routing
  const { theme } = useThemeStore(); // Retrieve the app's theme from the state management store

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
    >
      {/* Top section of the drawer */}
      <View>
        {/* Display the app logo, styled based on the current theme */}
        <View style={myStyles.LogoStyle}>
          <AppLogo />
        </View>

        {/* Welcome message for the user */}
        <View style={{ alignItems: "center", marginBottom: 8 }}>
          <MyText size="large">Welcome back, user!</MyText>
        </View>

        {/* Navigation item for 'Home' */}
        <DrawerItem
          label="Home"
          labelStyle={{ fontSize: 16 }}
          icon={({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate("(tabs)")}
        />

        {/* Navigation item for selecting the app theme */}
        <DrawerItem
          label="App Theme"
          labelStyle={{ fontSize: 16 }}
          icon={({ color, size }) => (
            <MaterialIcons name="palette" size={size} color={color} />
          )}
          onPress={() => {
            setBottomSheetIsVisible(true); // Show the theme selection bottom sheet
          }}
        />
      </View>

      {/* Bottom section of the drawer */}
      <View style={styles.bottomSection}>
        {/* Logout Button */}
        <DrawerItem
          label="Logout"
          labelStyle={{ fontSize: 16 }}
          icon={({ color, size }) => (
            <MaterialIcons name="exit-to-app" size={size} color={color} />
          )}
          onPress={() => router.replace("/(login)")} // Navigate to the login screen
        />

        {/* Display the app version from configuration */}
        <Text style={styles.versionText}>Version {appConfig.version}</Text>

        {/* Bottom sheet modal for theme selection */}
        <ThemeBottomsheet
          isVisible={bottomSheetIsVisible}
          setIsVisible={setBottomSheetIsVisible}
        />
      </View>
    </DrawerContentScrollView>
  );
}
