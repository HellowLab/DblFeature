import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./SearchItem.styles";
import { Movie } from "@/src/utils/APIs/TMDB";

// Define the properties expected by the SearchItem component
interface SearchItemProps {
  movie: Movie; // A movie object containing movie details
  onPress: () => void; // A callback function to handle press events
}

/**
 * Formats a date string into a human-readable format.
 *
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date string.
 */
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * A functional component that renders a movie item with its details.
 *
 * @param {SearchItemProps} props - The properties passed to the component.
 * @param {Movie} props.movie - The movie object containing its details.
 * @param {Function} props.onPress - The function to call when the item is pressed.
 * @returns {JSX.Element} - The rendered SearchItem component.
 */
const SearchItem: React.FC<SearchItemProps> = ({ movie, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Display movie poster image */}
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w92${movie.poster_path}` }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        {/* Display movie title */}
        <Text style={styles.title}>{movie.title}</Text>
        {/* Display formatted release date */}
        <Text style={styles.releaseDate}>{formatDate(movie.release_date)}</Text>
      </View>
      <View style={styles.voteContainer}>
        {/* Display movie vote average */}
        <Text style={styles.voteAverage}>{movie.vote_average} / 10</Text>
        {/* Display movie vote count */}
        <Text style={styles.voteCount}>({movie.vote_count} ratings)</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SearchItem;
