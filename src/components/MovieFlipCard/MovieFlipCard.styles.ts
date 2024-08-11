import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  movieCardContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cardContainer: {
    width: width * 0.9,
    height: 500,
  },
  card: {
    width: width * 0.9,
    height: 500,
    borderRadius: 20,
    justifyContent: "center",
  },
  cardShadow: {
    width: width * 0.9,
    height: 500,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    backgroundColor: "#ffffff", // Ensure solid background color for shadow calculation
    overflow: "hidden", // Add this to clip the content to the border radius
  },
  cardImageBackground: {
    flex: 1,
    justifyContent: "flex-end", // Align footer to the bottom
    borderRadius: 20, // Full border radius for the image background
  },
  cardBack: {
    backgroundColor: "#f8f9fa",
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
    borderRadius: 20, // Full border radius for the image
  },
  footer: {
    height: 60, // Fixed height for footer
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Make the footer slightly transparent
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
