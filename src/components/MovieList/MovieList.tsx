import React from "react";
import { TouchableOpacity, View } from "react-native";
import MyText from "@/src/components/TextOutput/TextOutput";
import { useTheme } from "@react-navigation/native";
import { createStyles } from "../../screens/MyMoviesScreen/MyMoviesScreen.styles";

// Define the interface for the props accepted by the MovieList component
export interface MovieListProps {
  item: any; // Represents the movie list object; replace `any` with a specific type if possible
  setSelectedListItem: (item: any) => void; // Function to set the currently selected list item
  setPopupVisible: (visible: boolean) => void; // Function to toggle the visibility of a popup
}

// Functional component for rendering an individual movie list item
const MovieList: React.FC<MovieListProps> = ({
  item, // The movie list data
  setSelectedListItem, // Callback to update the selected list item
  setPopupVisible, // Callback to toggle popup visibility
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  /**
   * Handle long press on the list item.
   * This action sets the selected item and makes the popup visible.
   */
  const handleLongPress = () => {
    setSelectedListItem(item); // Set the selected list item
    setPopupVisible(true); // Show the popup
  };

  // Render the movie list item
  return (
    <TouchableOpacity
      onPress={() => console.log("List pressed:", item)} // Log item details on press
      onLongPress={handleLongPress} // Trigger long press handler
      style={styles.listItem} // Apply styles for the list item
    >
      {/* Container for the list's content */}
      <View style={styles.listContent}>
        {/* Display the name of the movie list */}
        <MyText size="large" color="normal">
          {item.name}
        </MyText>
        {/* Conditionally display the list description if it exists */}
        {item.description && (
          <MyText size="medium" color="primary">
            {item.description}
          </MyText>
        )}
      </View>
      {/* Display the count of movies in the list */}
      <MyText size="medium" style={styles.movieCount}>
        {item.movies?.length || 0} movies
      </MyText>
    </TouchableOpacity>
  );
};

export default MovieList;
