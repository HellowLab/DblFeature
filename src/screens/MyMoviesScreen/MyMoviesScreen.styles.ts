import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
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
    listContainer: {
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    listContent: {
      flex: 1,
    },
    movieCount: {
      fontStyle: "italic",
      marginLeft: "auto", // Align movie count to the right
    },
    gridItem: {
      width: itemWidth,
      margin: spacing / 2,
    },
    listItem: {
      backgroundColor: colors.card,
      padding: 15,
      marginVertical: 8,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
      flexDirection: "row",
      alignItems: "center",
      height: 65,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: "70%",
      backgroundColor: colors.background,
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    input: {
      width: "100%",
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
      width: "100%",
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
