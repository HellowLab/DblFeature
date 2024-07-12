import { Gesture } from "react-native-gesture-handler";

/**
 * Custom hook to create a pan gesture handler for card dragging and swiping.
 *
 * @param {Function} handleCardDrag - Function to handle card dragging updates.
 * @param {Function} handleCardSwipeEnd - Function to handle the end of a card swipe.
 *
 * @returns {Object} A pan gesture handler configured with the provided drag and swipe end handlers.
 */
const usePanGesture = (
  handleCardDrag: (translationX: number, translationY: number) => void,
  handleCardSwipeEnd: (velocityX: number) => void
) => {
  return (
    Gesture.Pan()
      /**
       * Called continuously as the pan gesture is updated.
       *
       * @param {Object} event - The gesture event containing the updated translation values.
       */
      .onUpdate((event) => {
        "worklet";
        handleCardDrag(event.translationX, event.translationY);
      })
      /**
       * Called when the pan gesture ends.
       *
       * @param {Object} event - The gesture event containing the velocity of the swipe.
       */
      .onEnd((event) => {
        "worklet";
        handleCardSwipeEnd(event.velocityX);
      })
  );
};

export default usePanGesture;
