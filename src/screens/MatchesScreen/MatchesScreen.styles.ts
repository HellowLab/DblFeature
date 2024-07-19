import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    width: "100%",
    flex: 1,
    padding: 10,
  },
  container: {
    padding: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#F63A6E",
  },
  movie: {
    width: 100,
    height: 100,
    margin: 10,
    borderWidth: 3,
    borderColor: "#F63A6E",
    borderRadius: 50,
    padding: 2,
  },
  movies: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
});
