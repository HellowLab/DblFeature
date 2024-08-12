import React from "react";
import { View, TextInput, ViewStyle, TextStyle } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./SearchBar.styles";

// Define the props for the SearchBar component
interface SearchBarProps {
  query: string;
  onSearch: (text: string) => void;
  style?: ViewStyle; // Custom styles for the container
  inputStyle?: TextStyle; // Custom styles for the TextInput
}

/**
 * SearchBar component that allows users to input search queries.
 *
 * @param {SearchBarProps} props - The props for the component.
 * @param {string} props.query - The current search query.
 * @param {function} props.onSearch - Function to call when the search input changes.
 * @param {object} props.style - Custom styles to apply to the container.
 * @param {object} props.inputStyle - Custom styles to apply to the TextInput.
 * @returns {JSX.Element} The SearchBar component.
 */
const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onSearch,
  style,
  inputStyle,
}) => {
  return (
    <View style={[styles.searchContainer, style]}>
      {/* Display search icon */}
      <Icon name="search" size={24} color="gray" style={styles.searchIcon} />
      {/* Input field for search queries */}
      <TextInput
        style={[styles.searchInput, inputStyle]}
        placeholder="Search for a movie..."
        value={query}
        onChangeText={onSearch}
        placeholderTextColor="gray"
      />
    </View>
  );
};

export default SearchBar;
