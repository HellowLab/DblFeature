import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from "react-native";
import AutoScroll from "../AutoScroll";
import { styles } from "./MovieCard.styles";
import { CastMember, CrewMember } from "@/src/utils/types/types";

export interface MovieCardProps {
  id: number;
  name: string;
  image: string;
  bio: string;
  cast: CastMember[];
  crew: CrewMember[];
  reviews: string[];
}

// Function to extract initials from a name
const getInitials = (name: string) => {
  const nameParts = name.split(" ");
  const initials = nameParts.map((part) => part[0]).join("");
  return initials.toUpperCase();
};

const MovieCard: React.FC<{ movie: MovieCardProps }> = (props) => {
  const { name, image, bio, cast, crew, reviews } = props.movie;
  const [isExpanded, setIsExpanded] = useState(false);
  const [bioHeight, setBioHeight] = useState(0); // Measured bio height
  const [contentHeight, setContentHeight] = useState(50); // Initial height set to 50
  const [currentPage, setCurrentPage] = useState(0); // For pagination
  const numPages = 3; // Number of pages to swipe through

  const animatedHeight = useRef(new Animated.Value(50)).current; // Default initial height
  const animatedOpacity = animatedHeight.interpolate({
    inputRange: [50, Math.max(50, contentHeight)], // Ensure non-decreasing inputRange
    outputRange: [0.5, 1], // Gradually increase opacity as it expands
    extrapolate: "clamp",
  });
  const animatedScale = useRef(new Animated.Value(1)).current; // For bounce effect on card
  const leftCircleOpacity = useRef(new Animated.Value(0)).current; // Opacity for left semicircle
  const rightCircleOpacity = useRef(new Animated.Value(0)).current; // Opacity for right semicircle

  // Function to measure content height
  const onBioLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    setBioHeight(height);
  }, []);

  // Update animated height based on bio length
  useEffect(() => {
    if (bioHeight > 0) {
      setContentHeight(bioHeight + 10); // Add 10 pixels buffer to calculated height
    }
  }, [bioHeight]);

  // Animation for expanding bio
  useEffect(() => {
    Animated.spring(animatedHeight, {
      toValue: isExpanded ? contentHeight : 50,
      friction: 5,
      useNativeDriver: false, // Cannot use native driver with height
    }).start();
  }, [isExpanded, contentHeight]);

  // Function to toggle bio expansion
  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Function to handle swipe and add bounce effect
  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      // Determine which semicircle to animate based on swipe direction
      const targetOpacity =
        direction === "left" ? rightCircleOpacity : leftCircleOpacity;

      Animated.parallel([
        Animated.sequence([
          Animated.timing(animatedScale, {
            toValue: 1.025, // Slightly increase size
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
            toValue: 0.25, // Fade to half opacity
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

      // Change page
      if (direction === "left" && currentPage < numPages - 1) {
        setCurrentPage(currentPage + 1);
      } else if (direction === "right" && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    },
    [currentPage, numPages, leftCircleOpacity, rightCircleOpacity]
  );

  // Render cast and crew with auto-scroll
  const renderMembersWithAutoScroll = useCallback(
    (
      members: (CastMember | CrewMember)[],
      isCast: boolean,
      invertDirection: boolean
    ) => {
      if (members.length === 0) {
        return <Text style={styles.memberText}>No members available</Text>;
      }

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

  // Render main content based on the current page
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
            {reviews.map((review, index) => (
              <Text key={index} style={styles.review}>
                {review}
              </Text>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.cardWrapper}>
      <Animated.View
        style={[styles.card, { transform: [{ scale: animatedScale }] }]}
      >
        <ImageBackground
          source={{ uri: image }}
          style={styles.image}
          imageStyle={styles.imageStyle}
          blurRadius={currentPage > 0 ? 10 : 0} // Adjust blur as needed
        >
          <View style={styles.cardInner}>
            {/* Left Semicircle */}
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "65%",
                height: "100%", // Full height of the card
                borderTopRightRadius: 100, // Large radius to create a smooth curve
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
                height: "100%", // Full height of the card
                borderTopLeftRadius: 100, // Large radius to create a smooth curve
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
              <Animated.View
                style={{
                  height: animatedHeight,
                  backgroundColor: `rgba(0, 0, 0, ${animatedOpacity})`,
                  overflow: "hidden",
                }}
              >
                {/* This hidden View is used to measure the actual height */}
                <View
                  style={{ position: "absolute", opacity: 0, top: -1000 }}
                  onLayout={onBioLayout}
                >
                  <Text style={styles.bio}>{bio}</Text>
                </View>

                {/* Actual display of bio text */}
                <Text
                  style={styles.bio}
                  numberOfLines={isExpanded ? undefined : 2}
                >
                  {bio}
                </Text>
              </Animated.View>
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

        <View style={styles.pagination}>
          {/* Render pagination indicators */}
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
