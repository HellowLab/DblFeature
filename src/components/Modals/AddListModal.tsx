import React from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MyText from "@/src/components/TextOutput/TextOutput";
import { DjangoMovie } from "@/src/utils/types/types";
import { createStyles } from "../../screens/MyMoviesScreen/MyMoviesScreen.styles";
import { useTheme } from "@react-navigation/native";

// Define the props for the AddListModal component
interface AddListModalProps {
  longPressModalVisible: boolean; // Determines if the modal is visible
  setLongPressModalVisible: (visible: boolean) => void; // Function to toggle visibility of the modal
  movieLists: any[]; // List of movie lists available
  longPressedMovie: DjangoMovie; // The movie that was long pressed, used for adding to lists
  addMovieToList: (list: any, isNewList?: boolean) => void; // Function to add the movie to a selected list
  setNewListModalVisible: (visible: boolean) => void; // Function to toggle visibility of the 'Create New List' modal
  setIsAutoAddingToNewList: (value: boolean) => void; // Function to set whether a movie is automatically added to a newly created list
}

// Modal to add a long-pressed movie to a list or create a new list
const AddListModal: React.FC<AddListModalProps> = ({
  longPressModalVisible,
  setLongPressModalVisible,
  movieLists,
  longPressedMovie,
  addMovieToList,
  setNewListModalVisible,
  setIsAutoAddingToNewList,
}) => {
  const { colors } = useTheme(); // Get current theme colors for styling
  const styles = createStyles(colors); // Create styles based on theme

  // Handler for adding a movie to a new list
  const handleAddToNewList = () => {
    setIsAutoAddingToNewList(true); // Set the flag to indicate we are adding a movie directly to a new list
    setNewListModalVisible(true); // Open the 'Create New List' modal
    setLongPressModalVisible(false); // Close the current modal
  };

  return (
    <Modal
      animationType="fade" // Fades in/out the modal for better UX
      transparent={true} // Makes the background behind the modal transparent
      visible={longPressModalVisible} // Control the visibility of the modal
      onRequestClose={() => setLongPressModalVisible(false)} // Handle closing the modal when back button is pressed (Android)
    >
      {/* Closing the modal when tapping outside its content */}
      <TouchableWithoutFeedback onPress={() => setLongPressModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { paddingVertical: 20 }]}>
              {/* Header for the modal */}
              <MyText
                size="large"
                style={[styles.headerText, { marginBottom: 10 }]}
              >
                Add to List
              </MyText>

              {/* Container to display all movie lists */}
              <View style={{ flex: 1, width: "100%" }}>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                >
                  {/* Display each list that the user has */}
                  {movieLists.map((list) => {
                    // Check if the long-pressed movie is already in the list
                    const isInList = list.movies.some(
                      (movie: { id: number }) =>
                        movie.id === longPressedMovie.id
                    );
                    return (
                      <TouchableOpacity
                        key={list.id}
                        style={[
                          styles.listItem,
                          isInList && { backgroundColor: colors.primary }, // Highlight list items that already contain the movie
                        ]}
                        onPress={() => addMovieToList(list)} // Add movie to list when clicked
                      >
                        <MyText size="large" color="normal">
                          {list.name}
                        </MyText>
                        {/* Show a checkmark if the movie is already in the list */}
                        {isInList && (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="green"
                            style={{ marginLeft: "auto" }}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Footer with "Add to New List" button */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.createNewListButton}
                  onPress={handleAddToNewList} // Trigger the handler to add the movie to a new list
                >
                  <MyText size="large" style={{ color: colors.primary }}>
                    + Add to New List
                  </MyText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddListModal;
