import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  movieItemContainer: {
    marginBottom: 8,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  posterImage: {
    width: 66,
    height: 99,
  },
  movieInfoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-evenly",
  },
  iconContainer: {
    alignItems: "center",
  },
  sectionHeader: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});
