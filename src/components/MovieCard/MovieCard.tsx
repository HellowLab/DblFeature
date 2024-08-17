import { Text, View, ImageBackground, TouchableOpacity } from "react-native";
import { useState } from "react";
import React from "react";
import { styles } from "./MovieCard.styles";

export interface MovieCardProps {
  id: number;
  name: string;
  image: string;
  bio: string;
  cast: string[];
  crew: string[];
  reviews: string[];
}

const MovieCard: React.FC<{ movie: MovieCardProps }> = (props) => {
  const { name, image, bio, cast, crew, reviews } = props.movie;
  const [currentPage, setCurrentPage] = useState(0);
  const numPages = 3; // Total number of pages (bio, cast & crew, reviews)

  const handleSwipe = (direction: "left" | "right") => {
    let newPage = currentPage;

    if (direction === "left" && currentPage < numPages - 1) {
      newPage = currentPage + 1;
    } else if (direction === "right" && currentPage > 0) {
      newPage = currentPage - 1;
    }

    setCurrentPage(newPage);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 0:
        return (
          <View style={styles.pageContent}>
            <Text style={styles.title}>Overview</Text>
            <Text style={styles.bio}>{bio}</Text>
          </View>
        );
      case 1:
        return (
          <View style={styles.pageContent}>
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
          <View style={styles.pageContent}>
            <Text style={styles.title}>Reviews</Text>
            {(reviews || []).map((review, index) => (
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
          blurRadius={currentPage > 0 ? 10 : 0} // Apply blur on pages 2 and 3
        >
          <View style={styles.cardInner}>
            <TouchableOpacity
              style={styles.swipeAreaLeft}
              onPress={() => handleSwipe("right")}
            />
            <TouchableOpacity
              style={styles.swipeAreaRight}
              onPress={() => handleSwipe("left")}
            />
            <View style={styles.contentContainer}>
              <Text style={styles.name}>{name}</Text>
              {renderContent()}
            </View>
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
