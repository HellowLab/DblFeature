import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  currentCardContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  nextCardContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    alignSelf: "center",
  },

  png: {
    width: 150,
    height: 150,
    position: "absolute",
    top: 0,
    zIndex: 1,
    elevation: 1,
  },
});
