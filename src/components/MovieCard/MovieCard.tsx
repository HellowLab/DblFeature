import React, { useState, useRef } from "react";
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from "react-native";
import { styles } from "./MovieCard.styles";

// Define the interface for the MovieCard component's props
export interface MovieCardProps {
  id: number;
  name: string;
  image: string;
  bio: string;
  cast: string[];
  crew: string[];
  reviews: string[];
}

// MovieCard functional component that accepts a movie object as a prop
const MovieCard: React.FC<{ movie: MovieCardProps }> = (props) => {
  const { name, image, bio, cast, crew, reviews } = props.movie; // Destructure the movie object to extract its properties
  const [isExpanded, setIsExpanded] = useState(false); // State to track whether the bio section is expanded or not
  const [currentPage, setCurrentPage] = useState(0); // State to track the current page in the card (0 = default, 1 = Cast & Crew, 2 = Reviews)
  const numPages = 3; // Constant to define the number of pages in the card
  const animatedHeight = useRef(new Animated.Value(50)).current; // Animated value for controlling the height of the bio section

  /**
   * Handles swipe gestures to navigate between different pages in the card.
   * @param direction - The direction of the swipe ("left" or "right").
   */
  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && currentPage < numPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "right" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * Toggles the expansion of the bio section. The height of the section is animated.
   */
  const toggleExpand = () => {
    Animated.spring(animatedHeight, {
      toValue: isExpanded ? 50 : 250, // Expand or collapse the bio section
      friction: 5,
      useNativeDriver: false, // Animation should not use the native driver as height is being animated
    }).start();
    setIsExpanded(!isExpanded); // Toggle the expanded state
  };

  /**
   * Renders the main content of the card based on the current page.
   * Page 1 shows Cast & Crew, Page 2 shows Reviews.
   */
  const renderMainContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <View style={styles.centeredContent}>
            <Text style={styles.title}>Cast & Crew</Text>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cast:</Text>
              {(cast || []).map((member, index) => (
                <Text key={index} style={styles.member}>
                  {member}
                </Text>
              ))}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Crew:</Text>
              {(crew || []).map((member, index) => (
                <Text key={index} style={styles.member}>
                  {member}
                </Text>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.centeredContent}>
            <Text style={styles.title}>Reviews</Text>
            {(reviews || []).map((review, index) => (
              <Text key={index} style={styles.review}>
                {review}
              </Text>
            ))}
          </View>
        );
      default:
        return null; // Return null if the page is not Cast & Crew or Reviews
    }
  };

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        <ImageBackground
          source={{ uri: image }}
          style={styles.image}
          imageStyle={styles.imageStyle}
          blurRadius={currentPage > 0 ? 10 : 0} // Apply blur on pages 1 and 2
        >
          <View style={styles.cardInner}>
            {/* Render the main content based on the current page */}
            {renderMainContent()}
            {/* Footer with title and bio, visible on all pages */}
            <TouchableOpacity
              style={styles.contentContainer}
              onPress={toggleExpand}
              activeOpacity={0.8} // Reduce opacity on press for visual feedback
            >
              <Text style={styles.name}>{name}</Text>
              <Animated.View
                style={{ height: animatedHeight, overflow: "hidden" }} // Animated bio height
              >
                <Text
                  style={[styles.bio, !isExpanded ? styles.fadedBio : null]} // Apply faded style when collapsed
                  numberOfLines={isExpanded ? undefined : 2} // Limit lines when collapsed
                >
                  {bio}
                </Text>
              </Animated.View>
            </TouchableOpacity>
            {/* Clickable areas for swiping left and right */}
            <TouchableOpacity
              style={styles.swipeAreaLeft}
              onPress={() => handleSwipe("right")}
            />
            <TouchableOpacity
              style={styles.swipeAreaRight}
              onPress={() => handleSwipe("left")}
            />
          </View>
        </ImageBackground>

        {/* Pagination indicators */}
        <View style={styles.pagination}>
          {Array.from({ length: numPages }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.pageIndicator,
                index === currentPage ? styles.activeIndicator : {},
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default MovieCard;
