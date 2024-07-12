import { Text, View, ImageBackground, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
  card: {
    width: "95%",
    height: "70%",
    borderRadius: 10,

    // Used React Native Shadow Creator to get these shadow styles
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",

    justifyContent: "flex-end",
  },
  cardInner: {
    padding: 10,
  },
  name: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  bio: {
    fontSize: 18,
    color: "white",
    lineHeight: 24,
  },
});

export default Card;
