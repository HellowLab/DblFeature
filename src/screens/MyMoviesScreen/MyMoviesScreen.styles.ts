import { StyleSheet, Dimensions, ViewStyle } from "react-native";

const { width, height } = Dimensions.get("window");
const numColumns = 3;
const spacing = 12;
const itemWidth = (width - (numColumns + 1) * spacing) / numColumns;

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    toggleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingTop: 5,
      marginVertical: 5,
    },
    listNameContainer: {
      marginVertical: 10,
    },
    listContainer: {
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    centeredContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listName: {
      color: colors.text,
      fontSize: 16,
      textAlign: "center",
      marginVertical: 10,
    },
    listContent: {
      flex: 1,
    },
    disabledButton: {
      opacity: 0.5,
    },
    deleteFromListButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      backgroundColor: "transparent", // Optional: Change to desired background
      alignItems: "center",
    },
    movieCount: {
      fontStyle: "italic",
      marginLeft: "auto", // Align movie count to the right
      color: colors.accent,
    },
    gridItem: {
      width: itemWidth,
      margin: spacing / 2,
    },
    listItem: {
      backgroundColor: colors.card,
      paddingHorizontal: 15,
      marginVertical: 8,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
      flexDirection: "row",
      alignItems: "center",
      height: 55,
    },
    createNewListButton: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
      width: "100%",
      margin: 8,
    },
    posterImage: {
      width: "100%",
      aspectRatio: 2 / 3,
      borderRadius: 10,
    },
    ratingContainer: {
      marginTop: 4,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerText: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
    },
    smallModalContent: {
      width: "80%",
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    optionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    deleteButton: {
      backgroundColor: colors.error,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      flex: 1,
      alignItems: "center",
      marginRight: 5,
    },
    cancelButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      flex: 1,
      alignItems: "center",
      marginLeft: 5,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: width * 0.9,
      height: height * 0.6,
      backgroundColor: colors.background,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      borderColor: colors.border,
    },
    footer: {
      width: "100%",
      paddingHorizontal: 10,
      alignItems: "center",
    },

    input: {
      width: "95%",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 5,
      padding: 10,
      marginVertical: 10,
      color: colors.text,
      backgroundColor: colors.card,
    },
    createButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      width: "90%",
      alignItems: "center",
    },
    addButtonContainer: {
      position: "absolute",
      bottom: 20,
      left: 0,
      right: 0,
      alignItems: "center",
    },
    addButton: {
      justifyContent: "center",
      alignItems: "center",
    },
  });

// Define reusable styles for flash messages
export const flashMessageStyles: { [key: string]: ViewStyle } = {
  success: {
    height: 50,
    margin: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  danger: {
    height: 50,
    margin: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  warning: {
    height: 50,
    margin: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "orange",
  },
};
