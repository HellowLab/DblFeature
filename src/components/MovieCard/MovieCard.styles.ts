import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cardWrapper: {
    width: "100%",
    height: "95%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  card: {
    width: "100%",
    minWidth: 400,
    maxWidth: 400,
    height: "100%",
    borderRadius: 20,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6.68,
    elevation: 15,
    position: "relative",
    overflow: "hidden",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
    borderRadius: 0,
  },
  cardInner: {
    flex: 1,
    justifyContent: "flex-end",
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 20,
  },
  name: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    textAlign: "left",
  },
  bio: {
    fontSize: 18,
    color: "white",
    lineHeight: 24,
    textAlign: "left",
  },
  fadedBio: {
    opacity: 0.75,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "white",
  },
  swipeAreaLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: "100%",
    zIndex: 10,
  },
  swipeAreaRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    zIndex: 10,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginTop: 25,
    marginBottom: 10,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: "center",
  },
  castCrewContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  horizontalList: {
    flexDirection: "row",
    alignItems: "center",
  },
  gridItem: {
    width: 100,
    height: 20,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginVertical: 5,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
  autoScrollName: {
    width: "100%",
    height: 20,
  },
  autoScrollTitle: {
    width: "100%",
    height: 15,
  },
  backButton: {
    marginTop: 20, // Add some space at the top
    paddingVertical: 10, // Vertical padding for the button
    paddingHorizontal: 20, // Horizontal padding for the button
    backgroundColor: "#007BFF", // Blue background color for visibility
    borderRadius: 5, // Rounded corners
    alignSelf: "center", // Center the button horizontally
  },
  backButtonText: {
    color: "#FFFFFF", // White text color for contrast
    fontSize: 16, // Font size for the text
    fontWeight: "bold", // Bold text
    textAlign: "center", // Center the text within the button
  },
  memberText: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
  memberName: {
    fontSize: 12,
    color: "#ccc",
    textAlign: "center",
  },
  review: {
    fontSize: 16,
    color: "white",
    marginVertical: 5,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ccc",
    marginVertical: 5,
    marginLeft: 10,
    textAlign: "left",
  },
});
