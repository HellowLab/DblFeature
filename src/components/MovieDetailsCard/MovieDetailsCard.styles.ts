import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const BORDER_RADIUS = 20;
export const createStyles = (colors: any) =>
  StyleSheet.create({
    movieCardContainer: {
      alignItems: "center",
      justifyContent: "center",
      height: height * 0.6,
      width: width * 0.9,
      borderRadius: BORDER_RADIUS,
      borderWidth: 4,
      borderColor: colors.border,
    },
    cardContainer: {},
    card: {
      width: width * 0.9,
      height: height * 0.6,
      borderRadius: BORDER_RADIUS,
      justifyContent: "center",
    },
    cardShadow: {
      width: width * 0.9,
      height: height * 0.6,
      borderRadius: BORDER_RADIUS,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 4,
      backgroundColor: "#ffffff", // Ensure solid background color for shadow calculation
      overflow: "hidden", // Add this to clip the content to the border radius
    },
    cardImageBackground: {
      alignItems: "center",
      justifyContent: "center",
      height: height * 0.6,
      width: width * 0.9,

      borderRadius: BORDER_RADIUS,
    },
    cardBack: {
      justifyContent: "flex-start",
      gap: 16,
      padding: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#ddd", // Add a border to distinguish the card from the background
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 2,
    },
    backgroundImage: {
      borderRadius: BORDER_RADIUS, // Full border radius for the image
    },
    footer: {
      flex: 1,
      width: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.65)", // Make the footer slightly transparent
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 15,
    },
    movieTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
    },
    addButton: {
      padding: 10,
    },
    movieOverview: {
      fontSize: 16,
      textAlign: "center",
      color: "#333",
      marginBottom: 16,
    },
    movieDetailText: {
      fontSize: 14,
      textAlign: "center",
      color: "#555",
      marginBottom: 8,
    },
  });
