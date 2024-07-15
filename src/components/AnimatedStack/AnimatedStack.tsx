// Import necessary components from external libraries and local files
import { Text, View, ImageBackground } from "react-native";
import Animated from "react-native-reanimated";
import MovieCard from "../MovieCard";
import { GestureDetector } from "react-native-gesture-handler";
import { useCardAnimation, usePanGesture } from "@/src/hooks";
import { useEffect, useState } from "react";
import { styles } from "./AnimatedStack.styles";
// Ignore TypeScript errors for the image imports
//@ts-ignore
import LIKE from "../../assets/images/LIKE.png";
//@ts-ignore
import nope from "../../assets/images/nope.png";
import { MovieCardProps } from "../MovieCard/MovieCard";

// Define the props for the AnimatedStack component
export interface AnimatedStackProps {
  data: MovieCardProps[];
  onSwipeRight: (movie: MovieCardProps) => void;
  onSwipeLeft: (movie: MovieCardProps) => void;
}

/**
 * AnimatedStack component displays a stack of movie cards with swipe gestures.
 *
 * @param {AnimatedStackProps} props - The properties for the component.
 * @param {MovieCardProps[]} props.data - Array of movies to be displayed.
 * @param {Function} props.onSwipeRight - Function to call when a card is swiped right.
 * @param {Function} props.onSwipeLeft - Function to call when a card is swiped left.
 * @returns {JSX.Element} The AnimatedStack component.
 */
const AnimatedStack: React.FC<AnimatedStackProps> = ({
  data,
  onSwipeRight,
  onSwipeLeft,
}) => {
  // State to keep track of the current and next card indices
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  // Retrieve the current and next movie from the data array
  const currentMovie = data[currentIndex] ?? null;
  const nextMovie = data[nextIndex] ?? null;

  // Function to update the index after a card is swiped away
  const updateIndexAfterSwipeAway = () => {
    setCurrentIndex(currentIndex + 1);
  };

  // Retrieve animated styles and animation handlers from custom hook useCardAnimation
  const {
    cardStyle,
    nextCardStyle,
    likeStyle,
    nopeStyle,
    handleCardDrag,
    handleCardSwipeEnd,
    translateX,
    translateY,
  } = useCardAnimation(
    updateIndexAfterSwipeAway,
    onSwipeRight,
    onSwipeLeft,
    currentMovie
  );

  // Update nextIndex whenever currentIndex changes
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex, translateX]);

  // Retrieve custom panGesture based on animation handlers from custom hook usePanGesture
  const panGesture = usePanGesture(handleCardDrag, handleCardSwipeEnd);

  return (
    <>
      {/* Render the next movie card in the stack with animated styles */}
      {nextMovie && (
        <Animated.View style={[styles.nextCardContainer, nextCardStyle]}>
          <MovieCard movie={nextMovie} />
        </Animated.View>
      )}
      {/* Render the current movie card with swipe gestures */}
      {currentMovie && (
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.animatedCard, cardStyle]}>
            {/* Display the "Like" image */}
            <Animated.Image
              source={LIKE}
              style={[styles.png, { left: 10 }, likeStyle]}
              resizeMode="contain"
            />
            {/* Display the "Nope" image */}
            <Animated.Image
              source={nope}
              style={[styles.png, { right: 10 }, nopeStyle]}
              resizeMode="contain"
            />
            <MovieCard movie={currentMovie} />
          </Animated.View>
        </GestureDetector>
      )}
    </>
  );
};

export default AnimatedStack;
