import React, { useState, useRef } from "react";
import Swiper from "../Swiper";
import { View, Image, Animated, useWindowDimensions } from "react-native";
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

const AnimatedStack: React.FC<AnimatedStackProps> = ({
  data,
  onSwipeRight,
  onSwipeLeft,
}) => {
  // Get the dimensions of the window to calculate hidden positions
  const { width: screenWidth } = useWindowDimensions();

  // References to opacity, passed to Swiper to be updated as we swipe left and right
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const nopeOpacity = useRef(new Animated.Value(0)).current;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Reference to current card position, passed to Swiper to be updated as we swipe left and right
  // Used to scale up the size of the next card in the stack based on the position of the card's x position
  const cardPositionX = useRef(new Animated.Value(0)).current;

  // Scaling the next card based on the current card's position
  const scaleAnim = cardPositionX.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: [1.16, 0.8, 1.16],
    extrapolate: "clamp",
  });

  const currentMovie = data[currentIndex] ?? null;
  const nextMovie = data[currentIndex + 1] ?? null;

  const handleSwipe = (direction: string) => {
    if (direction === "right") {
      onSwipeRight(currentMovie);
    } else if (direction === "left") {
      onSwipeLeft(currentMovie);
    }

    // Reset the translation value after the swipe
    cardPositionX.setValue(0);

    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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

      {currentMovie && (
        <Swiper
          key={currentIndex}
          onSwipe={handleSwipe}
          overlay={{ likeOpacity, nopeOpacity }} // Pass the like and nope opacity references to the Swiper to be updated
          preventSwipe={["up", "down"]} // Prevent up and down swipes on cards
          cardPositionX={cardPositionX} // Pass the card x position reference to the Swiper to be updated
        >
          <Animated.View style={styles.currentCardContainer}>
            <Animated.Image
              source={LIKE}
              style={[styles.png, { left: 10, opacity: likeOpacity }]}
              resizeMode="contain"
            />
            <Animated.Image
              source={nope}
              style={[
                styles.png,
                {
                  right: 10,
                  top: 10,
                  opacity: nopeOpacity,
                  transform: [{ scale: 1.15 }],
                },
              ]}
              resizeMode="contain"
            />
            <MovieCard movie={currentMovie} />
          </Animated.View>
        </Swiper>
      )}
    </View>
  );
};

export default AnimatedStack;
