import movies from "../assets/data/users";
import AnimatedStack from "@/src/components/AnimatedStack";
import { onSwipeLeft, onSwipeRight } from "@/src/utils/callbacks";

/**
 * Home screen that displays the animated stack of movie cards with pan gestures.
 *
 * @returns {JSX.Element} The rendered screen.
 */
const HomeScreen = () => {
  return (
    <AnimatedStack
      data={movies}
      onSwipeRight={onSwipeRight}
      onSwipeLeft={onSwipeLeft}
    />
  );
};

export default HomeScreen;
