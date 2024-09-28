import "react-native";
import { Colors } from "../theme/theme";

declare module "@react-navigation/native" {
  export interface Theme {
    colors: typeof Colors.light; // Use custom color definitions
  }
}
