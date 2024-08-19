import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface StarRatingProps {
  maxStars?: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ maxStars = 5, initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState<number>(initialRating);

  const handleStarPress = (starNumber: number, event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const starWidth = event.target.measure((fx, fy, width) => width);
    const isHalfStar = locationX < 32 / 2;

    // TODO -- this is a temporary solution to handle half stars, the size should be dynamice
    const newRating = isHalfStar ? starNumber - 0.5 : starNumber;
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starNumber = index + 1;
        const starIcon = rating >= starNumber ? 'star' : (rating >= starNumber - 0.5 ? 'star-half-full' : 'star-o');

        return (
          <TouchableOpacity
            key={starNumber}
            onPress={(event) => handleStarPress(starNumber, event)}
            activeOpacity={0.7}
          >
            <Icon
              name={starIcon}
              size={32}
              color={starNumber < rating + 1  ? '#ffd700' : '#d3d3d3'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StarRating;
