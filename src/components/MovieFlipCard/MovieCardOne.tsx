import React from "react";
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from "react-native";
import { styles } from "./MovieFlipCard.styles";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { tmdbMovie, DjangoMovie, APIResponse } from "@/src/utils/types/types";
import StarRating from "../StarRating/StarRating";
import MyText from "../TextOutput/TextOutput";
import { createMovieResult, updateMovieResult } from "@/src/utils/APIs/api";

interface MovieCardProps {
  movie: tmdbMovie;
  movieResult?: DjangoMovie | null;
}

const MovieCardOne: React.FC<MovieCardProps> = ({ movie, movieResult }) => {
  // State variables to track user interactions
  const [isLiked, setIsLiked] = React.useState<boolean>(
    movieResult ? movieResult.liked === 1 : false // Initialize based on existing data if available
  );
  const [isDisliked, setIsDisliked] = React.useState<boolean>(
    movieResult ? movieResult.liked === 0 : false // Initialize based on existing data if available
  );
  const [rating, setRating] = React.useState<number>(
    movieResult?.myRating ?? 0 // Initialize rating from movieResult, default to 0 if not present
  );
  const [isTextVisible, setIsTextVisible] = React.useState<boolean>(true); // Track visibility of the footer text

  // Full path for the movie poster
  const fullPosterPath = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;

  // Animated value to control the opacity of the footer text
  const textOpacity = React.useRef(new Animated.Value(1)).current;

  /**
   * Toggles the visibility of the footer text with a fade animation.
   */
  const toggleTextVisibility = () => {
    Animated.timing(textOpacity, {
      toValue: isTextVisible ? 0 : 1, // Fade out or in based on current visibility
      duration: 115, // Duration of the animation
      useNativeDriver: true, // Optimize animation with native driver
    }).start();
    setIsTextVisible(!isTextVisible); // Update the state to reflect new visibility
  };

  /**
   * Handles the logic for like and dislike button presses.
   * @param button - 1 for 'like', 0 for 'dislike'
   */
  const handleLikeButtons = async (button: number) => {
    let likedValue = 2; // Default value (neither liked nor disliked)
    if (button === 1) {
      if (!isLiked) {
        likedValue = 1; // Set as liked
      }
      setIsLiked(!isLiked); // Toggle like state
      setIsDisliked(false); // Reset dislike state when liked
    } else if (button === 0) {
      if (!isDisliked) {
        likedValue = 0; // Set as disliked
      }
      setIsDisliked(!isDisliked); // Toggle dislike state
      setIsLiked(false); // Reset like state when disliked
    }

    let res: APIResponse;
    // Update existing movie result or create a new one based on whether movieResult exists
    if (movieResult) {
      res = await updateMovieResult(movieResult.id, likedValue);
    } else {
      res = await createMovieResult(
        movie.id,
        movie.title,
        likedValue,
        fullPosterPath
      );
    }

    // Handle API response
    if (res.status === 200 || res.status === 201) {
      // Success, no further action needed
    } else {
      console.error(res.message); // Log error message
      // Revert the state change in case of error
      if (button === 1) {
        setIsLiked(!isLiked);
      } else {
        setIsDisliked(!isDisliked);
      }
    }
  };

  /**
   * Handles the logic when a user presses a star to rate the movie.
   * @param newRating - The new rating selected by the user.
   */
  const handleStarPress = async (newRating: number) => {
    let res: APIResponse;
    const oldRating = rating; // Save current rating to restore in case of error
    setRating(newRating); // Update UI with new rating immediately
    if (movieResult) {
      res = await updateMovieResult(
        movieResult?.id,
        movieResult.liked,
        newRating
      );
    } else {
      res = await createMovieResult(
        movie.id,
        movie.title,
        2, // Default liked status to 'neither'
        fullPosterPath,
        newRating // Pass the new rating
      );
    }

    // Handle API response
    if (res.status !== 200 && res.status !== 201) {
      console.error(res.message); // Log error message
      setRating(oldRating); // Revert rating in case of error
    }
  };

  return (
    <ImageBackground
      source={{ uri: fullPosterPath }} // Set the movie poster as the background
      style={styles.cardImageBackground}
      imageStyle={styles.backgroundImage}
    >
      {/* Wrap the entire card in a TouchableOpacity to enable interaction */}
      <TouchableOpacity
        style={styles.movieCardContainer}
        activeOpacity={1}
        onPress={toggleTextVisibility} // Toggle footer visibility on press
      >
        {/* Animated footer with movie details */}
        <Animated.View style={[styles.footer, { opacity: textOpacity }]}>
          <MyText color="white" size="xxlarge" bold={true} align="center">
            {movie.title}
          </MyText>
          <MyText color="white" size="large" bold={true} align="center">
            {movie.overview}
          </MyText>
          <View style={{ gap: 8 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-evenly" }}
            >
              {/* Dislike button */}
              <TouchableOpacity
                onPress={() => handleLikeButtons(0)} // Handle dislike button press
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isDisliked ? "thumbs-down" : "thumbs-down-outline"}
                  color={isDisliked ? "red" : "white"} // Update icon and color based on state
                  size={30}
                />
              </TouchableOpacity>
              {/* Star rating component */}
              <StarRating
                maxStars={5}
                initialRating={rating} // Pass current rating
                onRatingChange={handleStarPress} // Handle star press
              />
              {/* Like button */}
              <TouchableOpacity
                onPress={() => handleLikeButtons(1)} // Handle like button press
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                  color={isLiked ? "green" : "white"} // Update icon and color based on state
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {/* Display release date */}
              <MyText color="white" align="center">
                Release Date: {movie.release_date}
              </MyText>
              {/* Display TMDB rating */}
              <MyText color="white" align="center">
                TMDB Rating: {movie.vote_average}
              </MyText>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default MovieCardOne;
