import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  Animated,
  Easing,
  LayoutChangeEvent,
  Platform,
} from "react-native";

// Interface defining the props for the AutoScrolling component
interface AutoScrollingProps {
  style?: object; // Optional custom styles for the container
  children: React.ReactElement; // React element(s) to be rendered and scrolled
  endPaddingWidth?: number; // Optional padding at the end of the scrolling content
  duration?: number; // Optional duration for the scrolling animation
  delay?: number; // Optional delay before the scrolling starts
  isBTT?: boolean; // Optional flag to indicate bottom-to-top scrolling
}

// AutoScrolling functional component
const AutoScrolling: React.FC<AutoScrollingProps> = ({
  style,
  children,
  endPaddingWidth = 0, // Default padding width
  duration, // Duration for the scrolling animation
  delay = 0, // Default delay before scrolling starts
  isBTT = false, // Default direction is top-to-bottom (not bottom-to-top)
}) => {
  // State to track if auto-scrolling is enabled
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);
  // State to store the height of the divider used for padding
  const [dividerHeight, setDividerHeight] = useState(endPaddingWidth);

  // Refs to store container and content heights and the animated value for scrolling
  const containerHeight = useRef<number>(0);
  const contentHeight = useRef<number>(0);
  const offsetY = useRef(new Animated.Value(0)).current;
  const contentRef = useRef<View | null>(null);

  // Callback to measure the container's height and update state accordingly
  const measureContainerView = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    // If the container height hasn't changed, do nothing
    if (containerHeight.current === height) return;
    containerHeight.current = height;

    // If contentRef is not set, do nothing
    if (!contentRef.current) return;

    // Measure the content's height and check its dimensions
    contentRef.current.measure((_x, _y, _width, height) => {
      checkContent(height, _x);
    });
  }, []);

  // Function to check and set content height, divider height, and start scrolling animation
  const checkContent = useCallback(
    (newContentHeight: number, fx: number) => {
      // If the new content height is zero, disable auto-scrolling
      if (!newContentHeight) {
        setIsAutoScrollEnabled(false);
        return;
      }

      // If content height hasn't changed, do nothing
      if (contentHeight.current === newContentHeight) return;
      contentHeight.current = newContentHeight;

      // Calculate and set new divider height if content height is less than container height
      let newDividerHeight = endPaddingWidth;
      if (contentHeight.current < containerHeight.current) {
        newDividerHeight = containerHeight.current - contentHeight.current;
      }
      setDividerHeight(newDividerHeight);
      setIsAutoScrollEnabled(true);

      // If bottom-to-top scrolling is enabled, set initial offset value
      if (isBTT) {
        offsetY.setValue(-(newContentHeight + newDividerHeight));
      }

      // Start the looping scrolling animation
      Animated.loop(
        Animated.timing(offsetY, {
          toValue: isBTT
            ? fx
            : -(contentHeight.current + fx + newDividerHeight),
          duration: duration || 50 * contentHeight.current, // Default duration is proportional to content height
          delay: delay, // Optional delay before animation starts
          easing: Easing.linear, // Linear easing for smooth scrolling
          useNativeDriver: Platform.OS !== "web", // Use native driver for better performance on non-web platforms
        })
      ).start();
    },
    [endPaddingWidth, duration, delay, isBTT, offsetY] // Dependencies for the callback
  );

  // Memoized children with onLayout and ref callback for dynamic content measurement
  const childrenCloned = useMemo(() => {
    return React.cloneElement(children, {
      ...children.props,
      onLayout: (event: LayoutChangeEvent) => {
        const { height, y } = event.nativeEvent.layout;
        // If container height or content height hasn't changed, do nothing
        if (!containerHeight.current || height === contentHeight.current)
          return;

        // Stop any ongoing animation and reset the offset
        offsetY.stopAnimation();
        offsetY.setValue(0);
        offsetY.setOffset(0);

        // Check the new content dimensions
        checkContent(height, y);
      },
      ref: (ref: View | null) => (contentRef.current = ref), // Assign content ref
    });
  }, [children, checkContent, offsetY]);

  return (
    // Container view that measures its own dimensions
    <View onLayout={measureContainerView} style={style}>
      <ScrollView
        horizontal={false} // Only vertical scrolling allowed
        bounces={false} // Disable bounce effect
        scrollEnabled={false} // Disable manual scrolling
        showsVerticalScrollIndicator={false} // Hide scroll indicator
      >
        <Animated.View
          style={{
            flexDirection: "column",
            transform: [{ translateY: offsetY }], // Apply vertical translation using animated value
          }}
        >
          {childrenCloned}
          {isAutoScrollEnabled && ( // Conditionally render additional space and children for scrolling
            <>
              <View style={{ height: dividerHeight }} />
              {children}
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// Export the component wrapped with React.memo for performance optimization
export default React.memo(AutoScrolling);
