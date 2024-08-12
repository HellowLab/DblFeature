import {
  useSharedValue,
  useDerivedValue,
  interpolate,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import {
  ROTATION,
  SWIPE_THRESHOLD_Y,
  SWIPE_VELOCITY,
} from "../utils/constants";
import { MovieCardProps } from "../components/MovieCard";

/**
 * Custom hook to handle card animations including dragging and swiping.
 *
 * @param {function} updateIndexAfterSwipeAway - Function to increment currentIndex in the movies array.
 * @param {function} onSwipeRight - Function to handle the 'like' action on a card swipe.
 * @param {function} onSwipeLeft - Function to handle the 'nope' action on a card swipe.
 * @param {MovieCardProps} currentMovie - The current movie being displayed.
 *
 * @returns {Object} An object containing animated styles, drag handler, swipe end handler, and shared values.
 */
const useCardAnimation = (
  updateIndexAfterSwipeAway: () => void,
  onSwipeRight: (movie: MovieCardProps) => void,
  onSwipeLeft: (movie: MovieCardProps) => void,
  currentMovie: MovieCardProps
) => {
  // Get the dimensions of the window to calculate hidden positions
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Calculate positions to which the card will translate when swiped away
  const hiddenTranslateX = 2 * screenWidth;
  const hiddenTranslateY = 1.2 * screenHeight;

  // Shared values for horizontal and vertical translations
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const animationsCompleted = useSharedValue(0);

  // Derived value for rotation based on the horizontal translation
  const rotate = useDerivedValue(
    () =>
      interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) +
      "deg"
  );

  // Animated style for the current card
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: rotate.value },
    ],
  }));

  // Animated style for the next card in the stack
  const nextCardStyle = useAnimatedStyle(() => ({
    // Scale the next card in from 0.85 scale to full size as front card is swiped away
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-hiddenTranslateX, 0, hiddenTranslateX],
          [1, 0.85, 1]
        ),
      },
    ],
    // Fade the next card in from 0.5 opacity to 1 as front card is swiped away
    opacity: interpolate(
      translateX.value,
      [-hiddenTranslateX, 0, hiddenTranslateX],
      [1, 0.5, 1]
    ),
  }));

  // Animated style for the like popup image for a card
  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, hiddenTranslateX / 4], [0, 1]),
  }));

  // Animated style for the nope popup image for a card
  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -hiddenTranslateX / 4], [0, 1]),
  }));

  /**
   * Handler to update card position during drag.
   *
   * @param {number} translationX - The horizontal translation value.
   * @param {number} translationY - The vertical translation value.
   */
  const handleCardDrag = (translationX: number, translationY: number) => {
    "worklet";
    translateX.value = translationX;
    translateY.value = translationY;
  };

  /**
   * Handler to determine the end state of the card after a swipe.
   *
   * @param {number} velocityX - The horizontal swipe velocity.
   */
  const handleCardSwipeEnd = (velocityX: number) => {
    "worklet";

    // Reset the completion counter
    animationsCompleted.value = 0;

    // Callback to run when an animation completes
    const checkAndUpdateIndex = () => {
      animationsCompleted.value += 1;
      if (animationsCompleted.value === 2) {
        // Only update the index after both x and y animations have been completed
        runOnJS(updateIndexAfterSwipeAway)();
        translateX.value = 0;
        translateY.value = 0;
      }
    };

    // Helper function to animate translationX
    const animateTranslateX = (value: number, callback: () => void) => {
      translateX.value = withSpring(value, {}, (isFinished) => {
        if (isFinished) callback();
      });
    };

    // Helper function to animate translationY
    const animateTranslateY = (value: number, callback: () => void) => {
      translateY.value = withSpring(value, {}, (isFinished) => {
        if (isFinished) callback();
      });
    };

    // If swipe velocity is slow, return card to the center
    if (Math.abs(velocityX) < SWIPE_VELOCITY) {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    } else {
      // Check if the change in translateY is significant
      if (Math.abs(translateY.value) < SWIPE_THRESHOLD_Y) {
        animationsCompleted.value += 1;
        // Only update translateX (swipe off just to the left and not up or down)
        animateTranslateX(
          hiddenTranslateX * Math.sign(translateX.value),
          checkAndUpdateIndex
        );
      } else {
        // Otherwise, update both translateX and translateY
        animateTranslateX(
          hiddenTranslateX * Math.sign(translateX.value),
          checkAndUpdateIndex
        );
        animateTranslateY(
          hiddenTranslateY * Math.sign(translateY.value),
          checkAndUpdateIndex
        );
      }

      // Activate Like or Nope logic based on swipe left or right
      const onSwipe = velocityX > 0 ? onSwipeRight : onSwipeLeft;
      onSwipe && runOnJS(onSwipe)(currentMovie);
    }
  };

  return {
    cardStyle, // Animated style for the current card
    nextCardStyle, // Animated style for the next card
    likeStyle, // Animated style for the like png
    nopeStyle, // Animated style for the nope png
    handleCardDrag, // Function to handle card dragging
    handleCardSwipeEnd, // Function to handle swipe end
    translateX, // Shared value for horizontal translation
    translateY, // Shared value for vertical translation
  };
};

export default useCardAnimation;
