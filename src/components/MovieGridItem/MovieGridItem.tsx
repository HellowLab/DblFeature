import React from "react";
import { TouchableOpacity, Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DjangoMovie } from "@/src/utils/types/types";
import { useTheme } from "@react-navigation/native";
import { createStyles } from "../../screens/MyMoviesScreen/MyMoviesScreen.styles";

export interface MovieGridItemProps {
  item: DjangoMovie; // Movie item to display
  handleMoviePress: (item: DjangoMovie) => void; // Function to handle movie click
  setLongPressedMovie: (movie: DjangoMovie) => void; // Function to set the long pressed movie
  setLongPressModalVisible: (visible: boolean) => void; // Function to set the visibility of the long press modal
}

const MovieGridItem: React.FC<MovieGridItemProps> = ({
  item,
  handleMoviePress,
  setLongPressedMovie,
  setLongPressModalVisible,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  /**
   * Handles the long press event on a movie.
   * Sets the long-pressed movie and makes the add-to-list modal visible.
   */
  const handleLongPress = () => {
    setLongPressedMovie(item); // Set the movie that was long-pressed
    setLongPressModalVisible(true); // Show the modal for adding the movie to a list
  };

  return (
    <TouchableOpacity
      onPress={() => handleMoviePress(item)} // Handle normal press to view movie details
      onLongPress={handleLongPress} // Handle long press to add to list
      style={styles.gridItem} // Apply styling to grid item
    >
      {/* Movie Poster Image */}
      <Image
        source={{ uri: item.poster || "https://via.placeholder.com/100x150" }} // Display movie poster or a placeholder if not available
        style={styles.posterImage} // Style for the movie poster image
      />
      {/* Rating Container to display stars */}
      <View style={styles.ratingContainer}>{renderStars(item, colors)}</View>
    </TouchableOpacity>
  );
};

/**
 * Renders the star rating for a movie based on the rating value.
 * Full stars and half stars are used to visually represent the rating.
 * @param item - The movie item containing the rating information
 * @param colors - Colors from the theme to apply consistent styles
 */
const renderStars = (item: DjangoMovie, colors: any) => {
  if (item.myRating != null && item.myRating > 0) {
    // Check if a valid rating exists
    const fullStars = Math.floor(item.myRating); // Number of full stars to display
    const hasHalfStar = item.myRating % 1 !== 0; // Determine if there should be a half star
    const stars = [];

    // Loop to add full stars to the stars array
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons
          key={`full-${i}`}
          name="star"
          size={14}
          color={colors.text} // Color for the star icon
          style={{ marginRight: 2 }} // Add space between stars
        />
      );
    }

    // Add a half star if necessary
    if (hasHalfStar) {
      stars.push(
        <Ionicons
          key="half"
          name="star-half"
          size={14}
          color={colors.text} // Color for the half star icon
          style={{ marginRight: 2 }}
        />
      );
    }

    // Return the star icons within a container
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {stars}
      </View>
    );
  }
  return null; // If no rating, return null
};

export default MovieGridItem;
