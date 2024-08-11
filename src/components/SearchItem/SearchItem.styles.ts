import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    flexShrink: 1,
  },
  releaseDate: {
    fontSize: 14,
    color: "#888",
  },
  voteContainer: {
    alignItems: "flex-end",
  },
  voteAverage: {
    fontSize: 14,
    color: "#888",
  },
  voteCount: {
    fontSize: 12,
    color: "#888",
  },
});
