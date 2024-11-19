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
      paddingHorizontal: 12,
      paddingTop: 5,
      marginVertical: 5,
    },
    gridContainer: {
      padding: spacing / 2,
    },
    gridItem: {
      width: itemWidth,
      margin: spacing / 2,
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
  });
