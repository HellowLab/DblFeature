/**
 * This Swiper component is an extension of the react-tinder-card library.
 * Reference: https://www.npmjs.com/package/react-tinder-card
 *
 * The readme associated with the react-tinder-card library is applicable to this Swiper component as well.
 * This component builds upon the functionalities provided by react-tinder-card, retaining all its core features,
 * while introducing additional enhancements specific to this implementation.
 *
 * You can use the react-tinder-card documentation as a reference, with the understanding that this component includes
 * extra features not covered in the original library's documentation.
 */

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  View,
  PanResponder,
  Dimensions,
  PanResponderInstance,
  GestureResponderEvent,
  PanResponderGestureState,
  Animated,
} from "react-native";
import { useSpring, animated, SpringValue } from "@react-spring/native";

// Get the height and width of the device's screen for calculations.
const { height, width } = Dimensions.get("window");

// Type definition for a 2D vector with x and y coordinates.
type Vector = {
  x: number;
  y: number;
};

// Type definition for the spring target used to control animations.
type SpringTarget = {
  current: {
    start: (config: any) => void; // Function to start the spring animation with a given configuration.
  }[];
};

// Type definition for gesture data captured during swiping.
type Gesture = {
  x: number;
  y: number;
  vx?: number; // Optional velocity in the x direction.
  vy?: number; // Optional velocity in the y direction.
  dx?: number; // Optional distance moved in the x direction.
  dy?: number; // Optional distance moved in the y direction.
};

// Type definition for the properties that can be passed to the Swiper component.
type SwiperProps = {
  flickOnSwipe?: boolean; // Flag to determine if cards should flick off the screen on swipe.
  children: React.ReactNode; // Child components to be rendered inside the swiper.
  onSwipe?: (dir: string) => void; // Callback function for when a swipe is detected.
  onCardLeftScreen?: (dir: string) => void; // Callback for when a card leaves the screen.
  className?: string; // Optional class name for styling purposes.
  preventSwipe?: string[]; // Array of directions in which swiping is prevented.
  swipeRequirementType?: "velocity" | "distance"; // Type of requirement to detect a swipe (velocity-based or distance-based).
  swipeThreshold?: number; // Custom threshold for swipe detection.
  overlay?: {
    likeOpacity: Animated.Value; // Animated value controlling the opacity of the "like" image.
    nopeOpacity: Animated.Value; // Animated value controlling the opacity of the "nope" image.
  };
  onSwipeRequirementFulfilled?: (dir: string) => void; // Callback when the swipe requirement is fulfilled.
  onSwipeRequirementUnfulfilled?: () => void; // Callback when the swipe requirement is not fulfilled.
};

// Enumeration type for possible swipe directions.
type SwipeDirection = "none" | "left" | "right" | "up" | "down";

// Configuration object containing settings for swipe animations.
const settings = {
  maxTilt: 25, // Maximum tilt angle in degrees when swiping.
  rotationPower: 50, // Multiplier for calculating rotation during swipe.
  swipeThreshold: 1, // Threshold value for detecting a swipe gesture.
};

// Physics settings for different types of spring animations.
const physics = {
  touchResponsive: {
    friction: 50, // Friction for touch-responsive animations.
    tension: 2000, // Tension for touch-responsive animations.
  },
  animateOut: {
    friction: 30, // Friction for animations that move the card off-screen.
    tension: 400, // Tension for animations that move the card off-screen.
  },
  animateBack: {
    friction: 10, // Friction for animations that return the card to its original position.
    tension: 200, // Tension for animations that return the card to its original position.
  },
};

/**
 * Calculates the hypotenuse of a right-angled triangle using the Pythagorean theorem.
 *
 * @param x - The length of one side of the triangle.
 * @param y - The length of the other side of the triangle.
 * @returns The hypotenuse of the triangle.
 */
const pythagoras = (x: number, y: number): number => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};

/**
 * Normalizes a vector, returning a unit vector pointing in the same direction.
 *
 * @param vector - The vector to normalize.
 * @returns The normalized vector.
 */
const normalize = (vector: Vector): Vector => {
  const length = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
  return { x: vector.x / length, y: vector.y / length };
};

/**
 * Animates the card out of view in the direction of the swipe gesture.
 *
 * @param gesture - The gesture data containing direction and velocity.
 * @param setSpringTarget - The spring target to control the animation.
 * @returns A promise that resolves once the animation is complete.
 */
const animateOut = async (
  gesture: Gesture,
  setSpringTarget: SpringTarget
): Promise<void> => {
  const diagonal = pythagoras(height, width); // Calculate the screen's diagonal length.
  const velocity = pythagoras(gesture.x, gesture.y); // Calculate the overall velocity of the gesture.
  const finalX = diagonal * gesture.x; // Calculate the final x-coordinate for the animation.
  const finalY = diagonal * gesture.y; // Calculate the final y-coordinate for the animation.
  const finalRotation = gesture.x * 45; // Calculate the final rotation based on the x-direction.
  const duration = diagonal / velocity; // Determine the duration of the animation.

  // Start the animation with the calculated target positions and rotation.
  setSpringTarget.current[0].start({
    x: finalX,
    y: finalY,
    rot: finalRotation,
    config: { duration: duration },
  });

  // Wait for the animation to complete before resolving.
  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, duration)
  );
};

/**
 * Animates the card back to its original position after a swipe gesture is released.
 *
 * @param setSpringTarget - The spring target to control the animation.
 * @returns A promise that resolves once the animation is complete.
 */
const animateBack = (setSpringTarget: SpringTarget): Promise<void> => {
  return new Promise((resolve) => {
    setSpringTarget.current[0].start({
      x: 0,
      y: 0,
      rot: 0, // Reset rotation to 0 degrees.
      config: physics.animateBack, // Use the "animateBack" physics settings.
      onRest: resolve, // Resolve the promise when the animation completes.
    });
  });
};

/**
 * Determines the direction of a swipe based on the gesture vector.
 *
 * @param property - The vector representing the swipe direction.
 * @returns The direction of the swipe as a string.
 */
const getSwipeDirection = (property: Vector): SwipeDirection => {
  if (Math.abs(property.x) > Math.abs(property.y)) {
    if (property.x > settings.swipeThreshold) {
      return "right";
    } else if (property.x < -settings.swipeThreshold) {
      return "left";
    }
  } else {
    if (property.y > settings.swipeThreshold) {
      return "down";
    } else if (property.y < -settings.swipeThreshold) {
      return "up";
    }
  }
  return "none"; // Return "none" if no significant swipe direction is detected.
};

// Define the animated version of the View component for use with react-spring animations.
const AnimatedView = animated(View);

/**
 * Swiper component that handles swipe gestures on cards and manages the animations.
 * It supports customizable swipe behavior, including preventing certain swipe directions,
 * and triggering callbacks when swipe actions occur.
 *
 * @param flickOnSwipe - Determines whether the card should flick off the screen when swiped.
 * @param children - The child elements to be rendered inside the swiper.
 * @param onSwipe - Callback function triggered when a swipe gesture is detected.
 * @param onCardLeftScreen - Callback function triggered when a card leaves the screen.
 * @param className - Optional class name for styling the swiper.
 * @param preventSwipe - Array of directions where swiping is prevented.
 * @param swipeRequirementType - Type of requirement (velocity or distance) for detecting a swipe.
 * @param swipeThreshold - Custom threshold for detecting a swipe.
 * @param onSwipeRequirementFulfilled - Callback triggered when the swipe requirement is fulfilled.
 * @param onSwipeRequirementUnfulfilled - Callback triggered when the swipe requirement is not fulfilled.
 * @param ref - Ref object to expose imperative methods to the parent component.
 * @returns The Swiper component.
 */
const Swiper = forwardRef<unknown, SwiperProps>(
  (
    {
      flickOnSwipe = true, // Default to flicking cards off the screen when swiped.
      children, // Child elements to be rendered inside the swiper.
      onSwipe, // Callback for handling swipe gestures.
      onCardLeftScreen, // Callback for when a card leaves the screen.
      className, // Optional class name for custom styling.
      preventSwipe = [], // Directions in which swiping is prevented.
      swipeRequirementType = "velocity", // Default to detecting swipes based on velocity.
      swipeThreshold = settings.swipeThreshold, // Use default swipe threshold unless specified.
      overlay, // Optional animated values controlling the opacity of the "like" and "nope" images.
      onSwipeRequirementFulfilled, // Callback for when swipe requirement is fulfilled.
      onSwipeRequirementUnfulfilled, // Callback for when swipe requirement is not fulfilled.
    },
    ref
  ) => {
    // Initialize spring values for controlling card position and rotation.
    const [{ x, y, rot }, setSpringTarget] = useSpring(() => ({
      x: 0,
      y: 0,
      rot: 0,
      config: physics.touchResponsive, // Use touch-responsive physics settings.
    }));

    // Update the swipe threshold setting with the provided value.
    settings.swipeThreshold = swipeThreshold;

    // Expose imperative methods to the parent component using the ref object.
    useImperativeHandle(ref, () => ({
      /**
       * Imperative method to programmatically swipe the card in a specified direction.
       *
       * @param dir - The direction in which to swipe the card ("right" by default).
       */
      async swipe(dir: SwipeDirection = "right") {
        if (onSwipe) onSwipe(dir); // Trigger the onSwipe callback if provided.
        const power = 1.3; // Power factor to determine swipe strength.
        const disturbance = (Math.random() - 0.5) / 2; // Random disturbance for swipe realism.

        // Animate the card out of view based on the specified direction.
        if (dir === "right") {
          await animateOut({ x: power, y: disturbance }, setSpringTarget);
        } else if (dir === "left") {
          await animateOut({ x: -power, y: disturbance }, setSpringTarget);
        } else if (dir === "up") {
          await animateOut({ x: disturbance, y: -power }, setSpringTarget);
        } else if (dir === "down") {
          await animateOut({ x: disturbance, y: power }, setSpringTarget);
        }

        // Trigger the onCardLeftScreen callback if provided.
        if (onCardLeftScreen) onCardLeftScreen(dir);
      },

      /**
       * Imperative method to restore the card to its original position.
       */
      async restoreCard() {
        await animateBack(setSpringTarget); // Animate the card back to its initial position.
      },
    }));

    /**
     * Handles the release of a swipe gesture, determining whether the card should be
     * flicked off the screen or returned to its original position.
     *
     * @param setSpringTarget - The spring target controlling the animation.
     * @param gesture - The gesture state containing movement and velocity data.
     */
    const handleSwipeReleased = useCallback(
      async (
        setSpringTarget: SpringTarget,
        gesture: PanResponderGestureState
      ) => {
        // Determine the direction of the swipe based on gesture velocity or distance.
        const dir = getSwipeDirection({
          x: swipeRequirementType === "velocity" ? gesture.vx : gesture.dx,
          y: swipeRequirementType === "velocity" ? gesture.vy : gesture.dy,
        });

        // If a swipe direction is detected and flicking is enabled:
        if (dir !== "none") {
          if (flickOnSwipe) {
            // Check if the swipe direction is not prevented:
            if (!preventSwipe.includes(dir)) {
              if (onSwipe) onSwipe(dir); // Trigger the onSwipe callback.

              // Animate the card out of view based on the detected swipe direction.
              await animateOut(
                swipeRequirementType === "velocity"
                  ? {
                      x: gesture.vx,
                      y: gesture.vy,
                    }
                  : normalize({ x: gesture.dx, y: gesture.dy }), // Normalize the direction vector to ensure consistent swiping behavior.
                setSpringTarget
              );

              if (onCardLeftScreen) onCardLeftScreen(dir); // Trigger the onCardLeftScreen callback.
              return;
            }
          }
        }

        // If no valid swipe direction is detected or flicking is disabled, animate the card back.
        animateBack(setSpringTarget);
      },
      [flickOnSwipe, onSwipe, onCardLeftScreen, preventSwipe] // Dependencies to ensure the callback is updated when props change.
    );

    // Track the current direction in which the swipe requirement is fulfilled.
    let swipeThresholdFulfilledDirection: SwipeDirection = "none";

    // Create the PanResponder instance for handling touch gestures on the card.
    const panResponder: PanResponderInstance = useMemo(
      () =>
        PanResponder.create({
          // Determine if the component should respond to the start of a touch.
          onStartShouldSetPanResponder: (
            evt: GestureResponderEvent,
            gestureState: PanResponderGestureState
          ) => false,
          onStartShouldSetPanResponderCapture: (
            evt: GestureResponderEvent,
            gestureState: PanResponderGestureState
          ) => false,
          onMoveShouldSetPanResponder: (
            evt: GestureResponderEvent,
            gestureState: PanResponderGestureState
          ) => {
            const { dx, dy } = gestureState;
            // Respond to the gesture if movement in any direction exceeds 2 pixels.
            return dx > 2 || dx < -2 || dy > 2 || dy < -2;
          },
          onMoveShouldSetPanResponderCapture: (
            evt: GestureResponderEvent,
            gestureState: PanResponderGestureState
          ) => {
            const { dx, dy } = gestureState;
            // Capture the gesture if movement in any direction exceeds 2 pixels.
            return dx > 2 || dx < -2 || dy > 2 || dy < -2;
          },

          // Handle the gesture when the responder is granted to this component.
          onPanResponderGrant: (
            evt: GestureResponderEvent,
            gestureState: PanResponderGestureState
          ) => {
            // Start the spring animation based on the initial touch position.
            setSpringTarget.current[0].start({
              x: gestureState.dx,
              y: gestureState.dy,
              rot: 0, // Reset rotation to 0.
              config: physics.touchResponsive, // Use touch-responsive physics settings.
            });
          },

          // Handle movement of the touch gesture to update the card's position and rotation.
          onPanResponderMove: (
            evt: GestureResponderEvent,
            gestureState: PanResponderGestureState
          ) => {
            // Check if the swipe requirement is fulfilled or unfulfilled.
            if (onSwipeRequirementFulfilled || onSwipeRequirementUnfulfilled) {
              const dir = getSwipeDirection({
                x:
                  swipeRequirementType === "velocity"
                    ? gestureState.vx
                    : gestureState.dx,
                y:
                  swipeRequirementType === "velocity"
                    ? gestureState.vy
                    : gestureState.dy,
              });
              // Trigger the appropriate callback based on the swipe direction.
              if (dir !== swipeThresholdFulfilledDirection) {
                swipeThresholdFulfilledDirection = dir;
                if (swipeThresholdFulfilledDirection === "none") {
                  if (onSwipeRequirementUnfulfilled)
                    onSwipeRequirementUnfulfilled();
                } else {
                  if (onSwipeRequirementFulfilled)
                    onSwipeRequirementFulfilled(dir);
                }
              }
            }

            // Calculate rotation based on horizontal swipe velocity.
            let rot = ((300 * gestureState.vx) / width) * 15; // Scale rotation by a factor of 15.
            rot = Math.max(Math.min(rot, settings.maxTilt), -settings.maxTilt); // Clamp rotation within the maximum tilt angle.

            // Update the spring animation to reflect the current gesture state.
            setSpringTarget.current[0].start({
              x: gestureState.dx,
              y: gestureState.dy,
              rot,
              config: physics.touchResponsive, // Use touch-responsive physics settings.
            });

            // Update the opacity of the like/nope images based on swipe direction and distance
            if (overlay) {
              const { dx } = gestureState;
              if (dx > 0) {
                // Swiping right
                overlay.likeOpacity.setValue(Math.min(dx / 100, 1));
                overlay.nopeOpacity.setValue(0);
              } else {
                // Swiping left
                overlay.nopeOpacity.setValue(Math.min(-dx / 100, 1));
                overlay.likeOpacity.setValue(0);
              }
            }
          },

          // Determine if the responder should release the gesture.
          onPanResponderTerminationRequest: (
            evt: GestureResponderEvent,
            gestureState: PanResponderGestureState
          ) => {
            return true; // Allow the responder to release the gesture.
          },

          // Handle the release of the touch gesture to either flick the card away or return it to its original position.
          onPanResponderRelease: (
            evt: GestureResponderEvent,
            gestureState: PanResponderGestureState
          ) => {
            handleSwipeReleased(setSpringTarget, gestureState); // Call the function to determine the appropriate action.

            // Reset opacity of overlay references to 0 on release
            if (overlay) {
              overlay.likeOpacity.setValue(0);
              overlay.nopeOpacity.setValue(0);
            }
          },
        }),
      [] // Empty dependency array ensures that the PanResponder instance is only created once.
    );

    return (
      <AnimatedView
        {...panResponder.panHandlers} // Attach the PanResponder gesture handlers to the animated view.
        style={{
          transform: [
            { translateX: x }, // Translate the card along the x-axis based on the spring value.
            { translateY: y }, // Translate the card along the y-axis based on the spring value.
            { rotate: rot.to((rotValue: number) => `${rotValue}deg`) }, // Rotate the card based on the spring value.
          ],
        }}
      >
        {children}
      </AnimatedView>
    );
  }
);

export default Swiper;
