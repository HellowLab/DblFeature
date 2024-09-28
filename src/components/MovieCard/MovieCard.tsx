import React, { useState, useRef, useCallback } from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import AutoScroll from "../AutoScroll";
import { styles } from "./MovieCard.styles";
import { CastMember, CrewMember, tmdbReview } from "@/src/utils/types/types";

export interface MovieCardProps {
  id: number;
  name: string;
  image: string;
  bio: string;
  cast: CastMember[];
  crew: CrewMember[];
  reviews: tmdbReview[];
}

/**
 * Extracts initials from a given name.
 *
 * @param {string} name - The full name.
 * @returns {string} - Initials of the name.
 */
const getInitials = (name: string): string => {
  const nameParts = name.split(" ");
  const initials = nameParts.map((part) => part[0]).join("");
  return initials.toUpperCase();
};

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * MovieCard component
 * Displays detailed information about a movie, including bio, cast, crew, reviews, and animated swipe transitions.
 *
 * @param {MovieCardProps} props - The properties for the movie card.
 * @returns {JSX.Element} - The rendered movie card component.
 */
const MovieCard: React.FC<{ movie: MovieCardProps }> = (props) => {
  const { name, image, bio, cast, crew, reviews } = props.movie;
  const [isExpanded, setIsExpanded] = useState(false); // Controls bio expansion
  const [currentPage, setCurrentPage] = useState(0); // Controls pagination
  const numPages = 3; // Number of content pages

  const animatedScale = useRef(new Animated.Value(1)).current; // Scale animation for bounce effect
  const leftCircleOpacity = useRef(new Animated.Value(0)).current; // Opacity for left swipe indication
  const rightCircleOpacity = useRef(new Animated.Value(0)).current; // Opacity for right swipe indication

  /**
   * Handles swipe actions, adding bounce and swipe animations.
   *
   * @param {"left" | "right"} direction - The direction of the swipe.
   */
  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      // Determine which semicircle to animate based on the swipe direction
      const targetOpacity =
        direction === "left" ? rightCircleOpacity : leftCircleOpacity;

      // Start parallel animations for bounce effect and opacity changes
      Animated.parallel([
        Animated.sequence([
          Animated.timing(animatedScale, {
            toValue: 1.025, // Slightly increase the size
            duration: 90,
            useNativeDriver: true,
          }),
          Animated.spring(animatedScale, {
            toValue: 1, // Bounce back to original size
            friction: 3,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(targetOpacity, {
            toValue: 0.25, // Fade to partial opacity
            duration: 90,
            useNativeDriver: true,
          }),
          Animated.timing(targetOpacity, {
            toValue: 0, // Fade back to transparent
            duration: 90,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Handle page navigation
      if (direction === "left" && currentPage < numPages - 1) {
        setCurrentPage(currentPage + 1);
      } else if (direction === "right" && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    },
    [currentPage, numPages, leftCircleOpacity, rightCircleOpacity]
  );

  /**
   * Renders cast or crew members with auto-scrolling feature.
   *
   * @param {Array<CastMember | CrewMember>} members - The list of members (cast or crew).
   * @param {boolean} isCast - Flag to indicate if the members are cast.
   * @param {boolean} invertDirection - Flag to invert scrolling direction.
   * @returns {JSX.Element} - Rendered members in auto-scroll view.
   */
  const renderMembersWithAutoScroll = useCallback(
    (
      members: (CastMember | CrewMember)[],
      isCast: boolean,
      invertDirection: boolean
    ) => {
      if (members.length === 0) {
        return <Text style={styles.memberText}>No members available</Text>;
      }

      // Split members into two rows
      const half = Math.ceil(members.length / 2);
      const firstRow = members.slice(0, half);
      const secondRow = members.slice(half);

      return (
        <View>
          <AutoScroll
            isHorizontal
            delay={100}
            duration={20000}
            style={{ height: 100 }}
            isRTL={invertDirection}
          >
            <View style={styles.horizontalList}>
              {firstRow.map((member, index) => (
                <View key={index} style={styles.gridItem}>
                  {member.profile_path ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w185${member.profile_path}`,
                      }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Text style={styles.initialsText}>
                        {getInitials(member.name)}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.memberText}>
                    {isCast
                      ? `${(member as CastMember).character}`
                      : `${(member as CrewMember).job}`}
                  </Text>
                  <Text style={styles.memberName}>{member.name}</Text>
                </View>
              ))}
            </View>
          </AutoScroll>
          <AutoScroll
            isHorizontal
            delay={100}
            duration={20000}
            style={{ height: 100 }}
            isRTL={invertDirection}
          >
            <View style={styles.horizontalList}>
              {secondRow.map((member, index) => (
                <View key={index} style={styles.gridItem}>
                  {member.profile_path ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w185${member.profile_path}`,
                      }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Text style={styles.initialsText}>
                        {getInitials(member.name)}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.memberText}>
                    {isCast
                      ? `${(member as CastMember).character}`
                      : `${(member as CrewMember).job}`}
                  </Text>
                  <Text style={styles.memberName}>{member.name}</Text>
                </View>
              ))}
            </View>
          </AutoScroll>
        </View>
      );
    },
    []
  );

  /**
   * Renders user reviews with vertical auto-scrolling.
   *
   * @returns {JSX.Element} - Rendered reviews.
   */
  const renderReviews = () => {
    if (!reviews || reviews.length === 0) {
      return <Text style={styles.noReviewsText}>No reviews available</Text>;
    }

    return (
      <View style={styles.reviewsContainer}>
        <AutoScroll
          isHorizontal={false}
          delay={2000}
          duration={170000}
          style={styles.autoScrollContainer}
        >
          <View style={styles.reviewsContent}>
            {reviews.map((review, index) => (
              <View key={index} style={styles.reviewCard}>
                {/* Author Info */}
                <View style={styles.authorContainer}>
                  {review.author_details.avatar_path ? (
                    <Image
                      source={{
                        uri: review.author_details.avatar_path.startsWith(
                          "/https"
                        )
                          ? review.author_details.avatar_path.substring(1)
                          : `https://image.tmdb.org/t/p/w185${review.author_details.avatar_path}`,
                      }}
                      style={styles.authorAvatar}
                    />
                  ) : (
                    <View style={styles.authorAvatarPlaceholder}>
                      <Text style={styles.authorInitials}>
                        {getInitials(
                          review.author_details.username || review.author
                        )}
                      </Text>
                    </View>
                  )}
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>
                      {review.author_details.username || review.author}
                    </Text>
                    {review.author_details.rating !== null && (
                      <Text style={styles.authorRating}>
                        Rating: {review.author_details.rating}/10
                      </Text>
                    )}
                  </View>
                </View>
                {/* Review Content */}
                <Text style={styles.reviewContent}>{review.content}</Text>
                {/* Review Date */}
                <Text style={styles.reviewDate}>
                  {new Date(review.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </AutoScroll>
      </View>
    );
  };

  /**
   * Renders the main content of the movie card based on the current page.
   *
   * @returns {JSX.Element|null} - Rendered content for the current page.
   */
  const renderMainContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <View style={styles.centeredContent}>
            <Text style={styles.title}>Cast & Crew</Text>
            <View style={styles.castCrewContainer}>
              <View>
                <Text style={styles.sectionTitle}>Cast:</Text>
                {renderMembersWithAutoScroll(cast, true, true)}
              </View>
              <View>
                <Text style={styles.sectionTitle}>Crew:</Text>
                {renderMembersWithAutoScroll(crew, false, false)}
              </View>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.centeredContent}>
            <Text style={styles.title}>Reviews</Text>
            {renderReviews()}
          </View>
        );
      default:
        return null;
    }
  };

  /**
   * Toggles the bio expansion using LayoutAnimation for smooth transitions.
   */
  const toggleExpand = useCallback(() => {
    LayoutAnimation.configureNext({
      duration: 200, // Animation duration
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <View style={styles.cardWrapper}>
      <Animated.View
        style={[styles.card, { transform: [{ scale: animatedScale }] }]}
      >
        <ImageBackground
          source={{ uri: image }}
          style={styles.image}
          imageStyle={styles.imageStyle}
          blurRadius={currentPage > 0 ? 10 : 0} // Apply blur based on page
        >
          <View style={styles.cardInner}>
            {/* Left Semicircle */}
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "65%",
                height: "100%",
                borderTopRightRadius: 100,
                borderBottomRightRadius: 100,
                backgroundColor: `rgba(0, 0, 0, 0.5)`,
                opacity: leftCircleOpacity,
              }}
            />
            {/* Right Semicircle */}
            <Animated.View
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "65%",
                height: "100%",
                borderTopLeftRadius: 100,
                borderBottomLeftRadius: 100,
                backgroundColor: `rgba(0, 0, 0, 0.5)`,
                opacity: rightCircleOpacity,
              }}
            />

            {renderMainContent()}
            <TouchableOpacity
              style={styles.contentContainer}
              onPress={toggleExpand}
              activeOpacity={0.8}
            >
              <Text style={styles.name}>{name}</Text>
              {/* Bio Section */}
              <View>
                <Text
                  style={styles.bio}
                  numberOfLines={isExpanded ? undefined : 2}
                >
                  {bio}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Swipe areas for pagination */}
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

        {/* Pagination Dots */}
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
      </Animated.View>
    </View>
  );
};

export default MovieCard;
