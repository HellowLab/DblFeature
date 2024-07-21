import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import {
  AppLogoDarkMode,
  AppLogoLightMode,
} from "@/src/components/images/AppLogo";
import { myStyles } from "@/src/utils/constants/styles";
import SubmitButton from "@/src/components/Buttons/SubmitButton";
import appConfig from "@/appConfig";
import { styles } from "./drawer.styles";

// Main layout component for the drawer
export default function Layout() {
  return (
    // GestureHandlerRootView is required to enable gesture handling in the app
    // Flex 1 ensures that the component takes up the full height of its parent
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => {
          return <CustomDrawerContent {...props} />;
        }}
        screenOptions={{ headerShown: false }}
      >
        {/* Define the screens available in the drawer navigator */}
        <Drawer.Screen name="(home)" options={{ title: "Home" }} />
        <Drawer.Screen name="(matches)" options={{ title: "My Matches" }} />
        <Drawer.Screen name="(search)" options={{ title: "Search" }} />
        <Drawer.Screen
          name="(tabs)"
          options={{ title: "Show Tab Navigator" }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

// Custom drawer content component
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
    >
      <View>
        {/* Display the app logo based on the color scheme */}
        <View style={myStyles.LogoStyle}>
          {colorScheme === "dark" ? <AppLogoDarkMode /> : <AppLogoLightMode />}
        </View>
        {/* Display the list of drawer items */}
        <DrawerItemList {...props} />
      </View>
      <View style={styles.bottomSection}>
        {/* Logout button */}
        <SubmitButton
          buttonText="Logout"
          onButtonClick={() => router.replace("/(login)")}
        />
        {/* Display the app version */}
        <Text style={styles.versionText}>Version {appConfig.version}</Text>
      </View>
    </DrawerContentScrollView>
  );
}
