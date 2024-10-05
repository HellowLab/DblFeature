import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  Animated,
  Easing,
  LayoutChangeEvent,
  Platform,
  Text, // Import Text component to ensure all text is rendered correctly
} from "react-native";

// Interface for component props
interface AutoScrollingProps {
  style?: object; // Optional style for the container view
  children: React.ReactElement; // React element to be displayed inside the auto-scrolling view
  endPaddingWidth?: number; // Optional padding at the end of the scroll view
  duration?: number; // Optional duration for the scrolling animation
  delay?: number; // Optional delay before the animation starts
  isBTT?: boolean; // Optional flag for bottom-to-top scrolling (vertical mode)
  isHorizontal?: boolean; // Optional flag for enabling horizontal scrolling
  isRTL?: boolean; // Optional flag for right-to-left scrolling (horizontal mode)
}

// Functional component for auto-scrolling content
const AutoScrolling: React.FC<AutoScrollingProps> = ({
  style,
  children,
  endPaddingWidth = 0, // Default padding width set to 0
  duration,
  delay = 0, // Default delay set to 0
  isBTT = false, // Default to top-to-bottom scrolling
  isHorizontal = false, // Default to vertical scrolling
  isRTL = false, // Default to left-to-right scrolling
}) => {
  // State to enable or disable auto-scrolling based on content size
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);

  // State to handle padding size at the end of the scroll view
  const [dividerHeight, setDividerHeight] = useState(endPaddingWidth);

  // Refs to store container and content dimensions
  const containerHeight = useRef<number>(0);
  const contentHeight = useRef<number>(0);

  // Animated value for the scroll offset
  const offsetY = useRef(new Animated.Value(0)).current;

  // Ref to the content view for measuring purposes
  const contentRef = useRef<View | null>(null);

  // Callback to measure container view dimensions
  const measureContainerView = useCallback(
    (event: LayoutChangeEvent) => {
      const { height, width } = event.nativeEvent.layout;
      const containerSize = isHorizontal ? width : height; // Choose width for horizontal scrolling, height otherwise

      // Check if container size has changed
      if (containerHeight.current === containerSize) return;
      containerHeight.current = containerSize;

      // Measure the content size
      if (!contentRef.current) return;
      contentRef.current.measure((_x, _y, width, height) => {
        checkContent(isHorizontal ? width : height, _x); // Pass the relevant dimension based on scrolling direction
      });
    },
    [isHorizontal] // Dependency array to optimize the function
  );

  // Function to check content size and adjust auto-scrolling
  const checkContent = useCallback(
    (newContentSize: number, fx: number) => {
      // Disable auto-scrolling if no content size is detected
      if (!newContentSize) {
        setIsAutoScrollEnabled(false);
        return;
      }

      // Check if content size has changed
      if (contentHeight.current === newContentSize) return;
      contentHeight.current = newContentSize;

      // If content fits within container, disable auto-scrolling
      if (contentHeight.current <= containerHeight.current) {
        setIsAutoScrollEnabled(false);
        offsetY.setValue(0); // Reset position
        return;
      }

      // Content exceeds container; enable auto-scroll
      let newDividerHeight = endPaddingWidth;

      setDividerHeight(newDividerHeight);
      setIsAutoScrollEnabled(true);

      // Set initial offset value for reverse scrolling (BTT or RTL)
      if (isBTT || isRTL) {
        offsetY.setValue(-(newContentSize + newDividerHeight));
      } else {
        offsetY.setValue(0);
      }

      // Start the auto-scrolling animation loop
      Animated.loop(
        Animated.timing(offsetY, {
          toValue:
            isBTT || isRTL
              ? fx // Use the offset value for reverse scrolling
              : -(contentHeight.current + fx + newDividerHeight), // Forward scrolling
          duration: duration || 50 * contentHeight.current, // Calculate duration based on content height if not provided
          delay: delay, // Apply the delay if specified
          easing: Easing.linear, // Use linear easing for smooth scrolling
          useNativeDriver: Platform.OS !== "web", // Enable native driver for better performance (except on web)
        })
      ).start();
    },
    [endPaddingWidth, duration, delay, isBTT, isRTL, offsetY] // Dependencies for the callback function
  );

  // Memoized children elements with applied layout measurement and reference handling
  const childrenCloned = useMemo(() => {
    return React.cloneElement(children, {
      ...children.props,
      onLayout: (event: LayoutChangeEvent) => {
        const { height, width, y } = event.nativeEvent.layout;
        const contentSize = isHorizontal ? width : height; // Use width for horizontal, height for vertical

        // Skip if container size is not set or content size is unchanged
        if (!containerHeight.current || contentSize === contentHeight.current)
          return;

        // Reset animation offsets
        offsetY.stopAnimation();
        offsetY.setValue(0);
        offsetY.setOffset(0);

        // Check content size and possibly restart animation
        checkContent(contentSize, y);
      },
      ref: (ref: View | null) => (contentRef.current = ref), // Set the reference to the content view
    });
  }, [children, checkContent, offsetY, isHorizontal]); // Dependencies for memoization

  // Render the auto-scrolling view
  return (
    <View onLayout={measureContainerView} style={style}>
      <ScrollView
        horizontal={isHorizontal} // Enable horizontal scrolling based on prop
        bounces={false} // Disable bounce effect
        scrollEnabled={false} // Disable manual scrolling
        showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator if in horizontal mode
      >
        <Animated.View
          style={{
            flexDirection: isHorizontal ? "row" : "column", // Set flex direction based on scrolling mode
            transform: [
              { translateX: isHorizontal ? offsetY : 0 }, // Horizontal translation
              { translateY: !isHorizontal ? offsetY : 0 }, // Vertical translation
            ],
          }}
        >
          {childrenCloned}
          {isAutoScrollEnabled && ( // Only render divider and duplicate children if auto-scrolling is enabled
            <>
              <View
                style={{
                  width: isHorizontal ? dividerHeight : undefined, // Divider for horizontal mode
                  height: !isHorizontal ? dividerHeight : undefined, // Divider for vertical mode
                }}
              />
              {children}
              {/* Duplicate children to create continuous scrolling effect */}
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default React.memo(AutoScrolling); // Memoize component to optimize re-renders
