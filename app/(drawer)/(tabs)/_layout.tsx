import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import FlashMessage from "react-native-flash-message";
import ProfilePicture from "@/src/components/images/ProfilePicture";
import FriendSearchModal from "@/src/components/FriendSearchModal"; 

export default function Stack2Layout() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isFriendModalVisible, setFriendModalVisible] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopWidth: 0,
            height: 60,
          },
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.accent,
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 8,
          },
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: "bold" },
          headerLeft: (props) => (
            <DrawerToggleButton {...props} tintColor={colors.white} />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', paddingRight: 12, alignItems: 'center' }}>
              <TouchableOpacity 
                onPress={() => setFriendModalVisible(true)}
                style={{ marginRight: 12 }}
              >
                <Ionicons name="person-add" size={24} color={colors.white} />
              </TouchableOpacity>
              <ProfilePicture
                size={40}
                onPress={() => router.push("/(accountsettings)")}
                color={colors.white}
              />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="(search)"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="(mymovies)"
          options={{
            title: "My Movies",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="film" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
      <FriendSearchModal 
        visible={isFriendModalVisible} 
        onClose={() => setFriendModalVisible(false)} 
      />
      <FlashMessage position="bottom" />
    </GestureHandlerRootView>
  );
}