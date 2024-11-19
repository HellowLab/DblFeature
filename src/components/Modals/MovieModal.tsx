import React from "react";
import { Modal, TouchableWithoutFeedback, View } from "react-native";
import { createStyles } from "../../screens/MyMoviesScreen/MyMoviesScreen.styles";
import { tmdbMovie, DjangoMovie } from "@/src/utils/types/types";
import { useTheme } from "@react-navigation/native";
import MovieCardOne from "../MovieFlipCard/MovieCardOne";

// Interface for MovieModal props to define required properties and their types
interface MovieModalProps {
  modalVisible: boolean; // State to track the visibility of the modal
  setModalVisible: (visible: boolean) => void; // Function to control modal visibility
  selectedMovie: tmdbMovie; // The movie object selected by the user
  selectedMovieResult: DjangoMovie | null; // Optional detailed information about the selected movie
}

// MovieModal component - used to display details of a selected movie in a modal
const MovieModal: React.FC<MovieModalProps> = ({
  modalVisible,
  setModalVisible,
  selectedMovie,
  selectedMovieResult,
}) => {
  const { colors } = useTheme(); // Get theme colors for consistent styling throughout the component
  const styles = createStyles(colors); // Create component-specific styles based on the theme colors

  return (
    <Modal
      animationType="fade" // Animation type for how the modal will appear/disappear
      transparent={true} // Makes the modal's background transparent
      visible={modalVisible} // Controls whether the modal is visible
      onRequestClose={() => setModalVisible(false)} // Called when the back button (on Android) or close action is triggered
    >
      {/* Close the modal when the user clicks outside the modal content */}
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Display a movie card with details of the selected movie */}
              <MovieCardOne
                movie={selectedMovie} // Passing the selected movie details to MovieCardOne
                movieResult={selectedMovieResult} // Passing additional information about the movie, if available
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default MovieModal;
