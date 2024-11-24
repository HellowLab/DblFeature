import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: 20,
    },
    profilePictureContainer: {
      alignItems: "center",
      marginBottom: 30,
    },
    bioContainer: {
      width: screenWidth - 40,
      marginBottom: 20,
    },
    bioInput: {
      padding: 12,
      fontSize: 16,
      borderRadius: 8,
      width: "100%",
      backgroundColor: colors.card,
      minHeight: 125,
      textAlignVertical: "top",
      color: colors.text,
    },
    rowContainer: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    halfInputContainer: {
      width: "48%", // Half-width for side-by-side inputs
    },
    optionContainer: {
      width: screenWidth - 40,
      marginBottom: 20,
    },
    input: {
      padding: 12,
      fontSize: 16,
      borderRadius: 8,
      backgroundColor: colors.card,
      color: colors.text,
      width: "100%",
    },
    fullWidthInput: {
      padding: 12,
      fontSize: 16,
      borderRadius: 8,
      width: "100%",
      backgroundColor: colors.card,
      color: colors.text,
    },
    comingSoonText: {
      marginTop: 5,
      fontSize: 12,
      color: colors.accent,
      textAlign: "center",
    },
    logoutButton: {
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
      width: screenWidth - 40,
      backgroundColor: colors.primary,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.white,
    },
  });
