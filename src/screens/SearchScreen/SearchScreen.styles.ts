import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    width: "100%",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  resultsList: {
    marginBottom: 16,
  },
  item: {
    padding: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemText: {
    fontSize: 16,
  },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  cardFront: {
    backgroundColor: "#ffffff",
    padding: 20,
  },
  cardBack: {
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  movieImage: {
    width: "100%",
    height: "70%",
    borderRadius: 20,
    marginBottom: 16,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
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
  movieDetails: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
