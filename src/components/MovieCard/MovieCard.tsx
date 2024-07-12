import { Text, View, ImageBackground } from "react-native";
import { styles } from "./MovieCard.styles";

// Card component props types
export interface CardProps {
  name: string;
  image: string;
  bio: string;
}

/**
 * Card component that displays a profile card with an image, name, and bio.
 *
 * @param {Object} props - The props for the component.
 * @param {CardProps} props.movie - The movie object containing name, image, and bio.
 */
const Card: React.FC<{ movie: CardProps }> = (props) => {
  const { name, image, bio } = props.movie;
  return (
    <View style={styles.card}>
      <ImageBackground
        source={{
          uri: image,
        }}
        style={styles.image}
      >
        <View style={styles.cardInner}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.bio}>{bio}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Card;
