import React, { useState, useRef } from "react";
import TinderCard from "react-tinder-card";
import { View, Image, Animated } from "react-native";
import MovieCard from "../MovieCard";
import { styles } from "./AnimatedStack.styles";
//@ts-ignore
import LIKE from "../../assets/images/LIKE.png";
//@ts-ignore
import nope from "../../assets/images/nope.png";
import { MovieCardProps } from "../MovieCard/MovieCard";

export interface AnimatedStackProps {
  data: MovieCardProps[]; // Array of movie data to be displayed
  onSwipeRight: (movie: MovieCardProps) => void; // Callback for when a card is swiped right
  onSwipeLeft: (movie: MovieCardProps) => void; // Callback for when a card is swiped left
}

/**
 * AnimatedStack Component
 *
 * A React functional component that displays a stack of cards with movies,
 * allowing the user to swipe through them. The current movie is displayed in
 * a swipeable TinderCard, and the next movie is shown with a scaling animation.
 *
 * @param data - Array of movie objects to be swiped through.
 * @param onSwipeRight - Function to be called when a movie card is swiped to the right.
 * @param onSwipeLeft - Function to be called when a movie card is swiped to the left.
 */
const AnimatedStack: React.FC<AnimatedStackProps> = ({
  data,
  onSwipeRight,
  onSwipeLeft,
}) => {
  // State to keep track of the current card index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animation value for scaling the next card
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Get the current movie to display, or null if no more movies are left
  const currentMovie = data[currentIndex] ?? null;

  // Get the next movie for the upcoming card, or null if it's the last card
  const nextMovie = data[currentIndex + 1] ?? null;

  /**
   * Handle swipe action
   *
   * @param direction - The direction of the swipe ("right" or "left")
   */
  const handleSwipe = (direction: string) => {
    if (direction === "right") {
      onSwipeRight(currentMovie);
    } else if (direction === "left") {
      onSwipeLeft(currentMovie);
    }

    // Animate the scaling of the next card and update the current index
    Animated.timing(scaleAnim, {
      toValue: 1, // Scale the next card to full size
      duration: 100, // Set the duration for a fast animation
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(currentIndex + 1); // Move to the next card
      scaleAnim.setValue(0.9); // Reset the scale for the next card
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* Render the next card with a scaling animation if it exists */}
      {nextMovie && (
        <Animated.View
          style={[
            styles.nextCardContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <MovieCard movie={nextMovie} />
        </Animated.View>
      )}

      {/* Render the current swipeable card if it exists */}
      {currentMovie && (
        <TinderCard key={currentIndex} onSwipe={handleSwipe}>
          <View style={styles.currentCardContainer}>
            {/* To be implemented: like/dislike indicators */}
            {/* 
            <Image
              source={LIKE}
              style={[styles.png, { left: 10 }]}
              resizeMode="contain"
            />
            <Image
              source={nope}
              style={[styles.png, { right: 10 }]}
              resizeMode="contain"
            />
            */}
            <MovieCard movie={currentMovie} />
          </View>
        </TinderCard>
      )}
    </View>
  );
};

export default AnimatedStack;
