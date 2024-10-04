import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useTheme } from "@react-navigation/native"; // Import useTheme to access colors
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AppLogo } from "@/src/components/images/AppLogo";
import { myStyles } from "@/src/utils/constants/styles";
import appConfig from "@/appConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./drawer.styles";
import MyText from "@/src/components/TextOutput/TextOutput";
import ThemeBottomsheet from "@/src/components/Modals/ThemeBottomSheet";

/**
 * Layout component responsible for rendering the app's main navigation drawer.
 * This includes multiple screens such as Home, My Movies, My Matches, Search, and a Tab Navigator.
 * The layout component is wrapped in a GestureHandlerRootView to ensure proper gesture support.
 *
 * @returns {JSX.Element} The root view with gesture handling enabled and a configured drawer component.
 */
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false, // Disable the Drawer header
        }}
        drawerContent={(props) => {
          return <CustomDrawerContent {...props} />;
        }}
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
  const { colors } = useTheme(); // Access colors from the current theme

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: colors.background, // Apply theme background color
      }}
    >
      {/* Top section of the drawer */}
      <View>
        {/* Display the app logo, styled based on the current theme */}
        <View style={myStyles.LogoStyle}>
          <AppLogo />
        </View>

        {/* Welcome message for the user */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <MyText size="large" style={{ color: colors.text }}>
            {/* Apply theme text color */}
            Welcome back, user!
          </MyText>
        </View>

        {/* Navigation item for 'Home' */}
        <DrawerItem
          label="Home"
          labelStyle={{ fontSize: 16, color: colors.text }} // Apply theme text color
          icon={({ size }) => (
            <MaterialIcons name="home" size={size} color={colors.text} /> // Apply theme icon color
          )}
          onPress={() => props.navigation.navigate("(tabs)")}
        />

        {/* Navigation item for selecting the app theme */}
        <DrawerItem
          label="App Theme"
          labelStyle={{ fontSize: 16, color: colors.text }} // Apply theme text color
          icon={({ size }) => (
            <MaterialIcons name="palette" size={size} color={colors.text} /> // Apply theme icon color
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
          labelStyle={{ fontSize: 16, color: colors.text }} // Apply theme text color
          icon={({ size }) => (
            <MaterialIcons name="exit-to-app" size={size} color={colors.text} /> // Apply theme icon color
          )}
          onPress={() => router.replace("/(login)")} // Navigate to the login screen
        />

        {/* Display the app version from configuration */}
        <Text style={[styles.versionText, { color: colors.text }]}>
          Version {appConfig.version}
        </Text>

        {/* Bottom sheet modal for theme selection */}
        <ThemeBottomsheet
          isVisible={bottomSheetIsVisible}
          setIsVisible={setBottomSheetIsVisible}
        />
      </View>
    </DrawerContentScrollView>
  );
}
