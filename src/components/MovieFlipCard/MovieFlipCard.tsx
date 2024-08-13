import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import FlipCard from "react-native-flip-card";
import { styles } from "./MovieFlipCard.styles";
import { Ionicons } from "@expo/vector-icons"; // Import icons for the add button

import { Movie, MovieResult } from "@/src/utils/types/types";

// Define the props for the MovieFlipCard component
interface MovieCardProps {
  movie: Movie;
}

/**
 * MovieFlipCard component that displays a movie card with flip functionality.
 * The card shows the movie poster on the front and details on the back.
 *
 * @param {MovieCardProps} props - The props for the component.
 * @param {Movie} props.movie - The movie object containing details such as title, poster path, overview, release date, and rating.
 * @returns {JSX.Element} The MovieFlipCard component.
 */
const MovieFlipCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <View style={styles.movieCardContainer}>
      <FlipCard
        style={styles.cardContainer}
        flipHorizontal={true}
        flipVertical={false}
        clickable={true}
      >
        {/* Face Side of the Card */}
        <View style={styles.cardShadow}>
          <ImageBackground
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.cardImageBackground}
            imageStyle={styles.backgroundImage}
          >
            <View style={styles.footer}>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add-circle" size={24} color="green" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        {/* Back Side of the Card */}
        <View style={[styles.card, styles.cardBack]}>
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <Text style={styles.movieOverview}>{movie.overview}</Text>
          <Text style={styles.movieDetailText}>
            Release Date: {movie.release_date}
          </Text>
          <Text style={styles.movieDetailText}>
            Rating: {movie.vote_average}
          </Text>
          {/* Additional movie details can be added here */}
        </View>
      </FlipCard>
    </View>
  );
};

export default MovieFlipCard;
