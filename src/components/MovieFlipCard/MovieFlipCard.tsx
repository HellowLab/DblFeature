import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import FlipCard from "react-native-flip-card";
import { Movie } from "@/src/utils/APIs/TMDB";
import { styles } from "./MovieFlipCard.styles";

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
        <View style={[styles.card, styles.cardFront]}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.movieImage}
          />
          <Text style={styles.movieTitle}>{movie.title}</Text>
        </View>
        {/* Back Side of the Card */}
        <View style={[styles.card, styles.cardBack]}>
          <ScrollView contentContainerStyle={styles.movieDetails}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.movieOverview}>{movie.overview}</Text>
            <Text style={styles.movieDetailText}>
              Release Date: {movie.release_date}
            </Text>
            <Text style={styles.movieDetailText}>
              Rating: {movie.vote_average}
            </Text>
            {/* Additional movie details can be added here */}
          </ScrollView>
        </View>
      </FlipCard>
    </View>
  );
};

export default MovieFlipCard;
