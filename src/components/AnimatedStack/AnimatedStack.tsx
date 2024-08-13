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
  data: MovieCardProps[];
  onSwipeRight: (movie: MovieCardProps) => void;
  onSwipeLeft: (movie: MovieCardProps) => void;
}

const AnimatedStack: React.FC<AnimatedStackProps> = ({
  data,
  onSwipeRight,
  onSwipeLeft,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.9)).current; // Start the next card at a slightly smaller scale

  const currentMovie = data[currentIndex] ?? null;
  const nextMovie = data[currentIndex + 1] ?? null;

  const handleSwipe = (direction: string) => {
    if (direction === "right") {
      onSwipeRight(currentMovie);
    } else if (direction === "left") {
      onSwipeLeft(currentMovie);
    }

    Animated.timing(scaleAnim, {
      toValue: 1, // Scale the next card to full size
      duration: 100, // Set the duration for a fast animation
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      scaleAnim.setValue(0.9); // Reset the scale for the next card
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {nextMovie && (
        <Animated.View
          style={[
            styles.nextCardContainer,
            { transform: [{ scale: scaleAnim }] }, // Apply scaling animation
          ]}
        >
          <MovieCard movie={nextMovie} />
        </Animated.View>
      )}

      {currentMovie && (
        <TinderCard key={currentIndex} onSwipe={handleSwipe}>
          <View style={styles.currentCardContainer}>
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
            <MovieCard movie={currentMovie} />
          </View>
        </TinderCard>
      )}
    </View>
  );
};

export default AnimatedStack;
