import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { usePanGesture, useCardAnimation } from "@/src/hooks";
import MovieCard from "@/src/components/MovieCard";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import movies from "../src/assets/data/users";
//@ts-ignore
import LIKE from "../src/assets/images/LIKE.png";
//@ts-ignore
import nope from "../src/assets/images/nope.png";

/**
 * Main application component that displays movie cards with pan gestures.
 *
 * @returns {JSX.Element} The rendered component.
 */
const App = () => {
  // State to keep track of which card in the stack is currently selected, and whats next
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  // Get the current and next movies from the movies array
  const currentMovie = movies[currentIndex];
  const nextMovie = movies[nextIndex];

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

  // Retrieve custom panGesture based on animation handlers from custom hook usePanGesture
  const panGesture = usePanGesture(handleCardDrag, handleCardSwipeEnd);

  // Every time currentIndex is updated, ensure we also update nextIndex
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex, translateX]);

  return (
    <View style={styles.pageContainer}>
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
    </View>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  animatedCard: {
    width: "90%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  nextCardContainer: {
    width: "95%",
    height: "75%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  png: {
    width: 150,
    height: 150,
    position: "absolute",
    top: 0,
    zIndex: 1,
    elevation: 1,
  },
});

export default App;
