import { Text, View, ImageBackground } from "react-native";
import Animated from "react-native-reanimated";
import MovieCard from "../MovieCard";
import { GestureDetector } from "react-native-gesture-handler";
import { useCardAnimation, usePanGesture } from "@/src/hooks";
import { useEffect, useState } from "react";
import { styles } from "./AnimatedStack.styles";
//@ts-ignore
import LIKE from "../../assets/images/LIKE.png";
//@ts-ignore
import nope from "../../assets/images/nope.png";
import { MovieCardProps } from "../MovieCard/MovieCard";

// Card component props types
export interface AnimatedStackProps {
  data: MovieCardProps[];
}

/**
 * Card component that displays a profile card with an image, name, and bio.
 *
 * @param {Object} data - An array of movies to be displayed in the animated stack. Each movie is of type MovieCardProps
 */
const AnimatedStack: React.FC<AnimatedStackProps> = ({ data }) => {
  // State to keep track of which card in the stack is currently selected, and whats next
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  // Callback function to grant setCurrentIndex access to useCardAnimation
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
  } = useCardAnimation(updateIndexAfterSwipeAway);

  // Every time currentIndex is updated, ensure we also update nextIndex
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex, translateX]);

  // Get the current and next movies from the movies array
  const currentMovie = data[currentIndex] ?? null;
  const nextMovie = data[nextIndex] ?? null;

  // Retrieve custom panGesture based on animation handlers from custom hook usePanGesture
  const panGesture = usePanGesture(handleCardDrag, handleCardSwipeEnd);

  return (
    <>
      {/* Next movie card in the stack, styled with animated styles */}
      {nextMovie && (
        <Animated.View style={[styles.nextCardContainer, nextCardStyle]}>
          <MovieCard movie={nextMovie} />
        </Animated.View>
      )}
      {/* Top movie card on stack, enabled with swipe gestures */}
      {currentMovie && (
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.animatedCard, cardStyle]}>
            {/* Like png */}
            <Animated.Image
              source={LIKE}
              style={[styles.png, { left: 10 }, likeStyle]}
              resizeMode="contain"
            />
            {/* Nope png */}
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
