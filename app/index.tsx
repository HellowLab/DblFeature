import { View, StyleSheet, useWindowDimensions } from "react-native";
import Card from "@/src/components/MovieCard";
import movies from "../src/assets/data/users";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useDerivedValue,
  interpolate,
  withSpring,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { useState } from "react";

// Define the context type for gesture handling (to satisfy typescript requirements)
interface GestureContext extends Record<string, unknown> {
  startX: number;
  startY: number;
}

export default function Index() {
  // Screen height and width
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  // State to keep track of which card in the stack we have selected
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMovie = movies[currentIndex];

  /**
   * Multiplying screenWidth by 2 allows the max rotation of +-35deg to be reached
   * when the entire card is off the screen. Otherwise, max rotation is reached when
   * the card is about halfway off the screen.
   */
  const hiddenTranslateX = 2 * screenWidth;

  // Shared value for horizontal translation
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useDerivedValue(
    () => interpolate(translateX.value, [0, hiddenTranslateX], [0, -35]) + "deg"
  );

  // Animated style for the card, applying the translation value
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
      {
        rotate: rotate.value,
      },
    ],
  }));

  // Gesture handler for pan gestures (card swipes)
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    // When the gesture starts, store the current translateX value in the context
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    // When the gesture is active, update the translateX value based on the gesture movement
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    // When the gesture ends, spring the card back to center
    onEnd: (context) => {
      //
      (translateX.value = withSpring(0)), (translateY.value = withSpring(0));
    },
  });

  return (
    <View style={styles.pageContainer}>
      {/* PanGestureHandler to handle horizontal drag gestures */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        {/* Animated view that applies the cardStyle for smooth animation */}
        <Animated.View style={[styles.animatedCard, cardStyle]}>
          {/* Render the card component with movie data */}
          <Card movie={currentMovie} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

// StyleSheet for styling the components
const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  animatedCard: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
