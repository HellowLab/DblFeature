import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserStore } from "@/src/utils/store/UserStore";
import { deleteToken } from "@/src/utils/store/TokenStore";
import { getStyles } from "./AccountSettingsScreenStyles";

export default function AccountSettingsScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors); // Pass colors to the styles function
  const router = useRouter();

  const logout = () => {
    // Clear the user data from the global store
    useUserStore.setState({ user: null });

    // Clear the user token from the secure store
    deleteToken();

    // Navigate to the login screen
    router.replace("/(login)");
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture Placeholder */}
      <View style={styles.profilePictureContainer}>
        <MaterialIcons
          name="account-circle"
          size={100}
          color={colors.primary}
        />
        <Text style={styles.comingSoonText}>Profile Picture (Coming Soon)</Text>
      </View>

      {/* Add Bio */}
      <View style={styles.bioContainer}>
        <TextInput
          style={styles.bioInput}
          placeholder="Add Bio"
          placeholderTextColor={colors.text}
          editable={false}
          multiline={true}
          textAlign="center"
        />
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </View>

      {/* First Name and Last Name */}
      <View style={styles.rowContainer}>
        <View style={styles.halfInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Change First Name"
            placeholderTextColor={colors.text}
            editable={false}
            textAlign="center"
          />
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
        <View style={styles.halfInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Change Last Name"
            placeholderTextColor={colors.text}
            editable={false}
            textAlign="center"
          />
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      </View>

      {/* Username and Email */}
      <View style={styles.rowContainer}>
        <View style={styles.halfInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Change Username"
            placeholderTextColor={colors.text}
            editable={false}
            textAlign="center"
          />
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
        <View style={styles.halfInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Change Email"
            placeholderTextColor={colors.text}
            editable={false}
            textAlign="center"
          />
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      </View>

      {/* Password Fields */}
      <View style={styles.optionContainer}>
        <TextInput
          style={styles.fullWidthInput}
          placeholder="Change Password"
          placeholderTextColor={colors.text}
          editable={false}
          textAlign="center"
        />
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </View>
      <View style={styles.optionContainer}>
        <TextInput
          style={styles.fullWidthInput}
          placeholder="Confirm Change Password"
          placeholderTextColor={colors.text}
          editable={false}
          textAlign="center"
        />
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
