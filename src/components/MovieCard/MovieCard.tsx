import { Text, View, ImageBackground } from "react-native";
import { styles } from "./MovieCard.styles";

// Define the props for the MovieCard component
export interface MovieCardProps {
  id: number;
  name: string;
  image: string;
  bio: string;
}

/**
 * MovieCard component that displays a profile card with an image, name, and bio.
 *
 * @param {Object} props - The props for the component.
 * @param {MovieCardProps} props.movie - The movie object containing name, image, and bio.
 * @returns {JSX.Element} The MovieCard component.
 */
const MovieCard: React.FC<{ movie: MovieCardProps }> = (props) => {
  // Destructure movie properties from props
  const { name, image, bio } = props.movie;

  return (
    <View style={styles.card}>
      {/* Display the movie image as a background */}
      <ImageBackground source={{ uri: image }} style={styles.image}>
        <View style={styles.cardInner}>
          {/* Display the movie name */}
          <Text style={styles.name}>{name}</Text>
          {/* Display the movie bio */}
          <Text style={styles.bio}>{bio}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default MovieCard;
