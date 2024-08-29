import React, { useState, useRef, useEffect } from "react";
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

const MovieCard: React.FC<{ movie: MovieCardProps }> = (props) => {
  const { name, image, bio, cast, crew, reviews } = props.movie;
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const numPages = 3;
  const animatedHeight = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    console.log("Cast members:", cast);
    console.log("Crew members:", crew);
  }, [cast, crew]);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && currentPage < numPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "right" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleExpand = () => {
    Animated.spring(animatedHeight, {
      toValue: isExpanded ? 50 : 250,
      friction: 5,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const renderMembersWithAutoScroll = (
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
                  <View style={styles.placeholderImage} />
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
                  <View style={styles.placeholderImage} />
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
  };

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
      <View style={styles.card}>
        <ImageBackground
          source={{ uri: image }}
          style={styles.image}
          imageStyle={styles.imageStyle}
          blurRadius={currentPage > 0 ? 10 : 0}
        >
          <View style={styles.cardInner}>
            {renderMainContent()}
            <TouchableOpacity
              style={styles.contentContainer}
              onPress={toggleExpand}
              activeOpacity={0.8}
            >
              <Text style={styles.name}>{name}</Text>
              <Animated.View
                style={{ height: animatedHeight, overflow: "hidden" }}
              >
                <Text
                  style={[styles.bio, !isExpanded ? styles.fadedBio : null]}
                  numberOfLines={isExpanded ? undefined : 2}
                >
                  {bio}
                </Text>
              </Animated.View>
            </TouchableOpacity>
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
