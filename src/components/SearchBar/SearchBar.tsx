import React from "react";
import { View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./SearchBar.styles";

// Define the props for the SearchBar component
interface SearchBarProps {
  query: string;
  onSearch: (text: string) => void;
}

/**
 * SearchBar component that allows users to input search queries.
 *
 * @param {SearchBarProps} props - The props for the component.
 * @param {string} props.query - The current search query.
 * @param {function} props.onSearch - Function to call when the search input changes.
 * @returns {JSX.Element} The SearchBar component.
 */
const SearchBar: React.FC<SearchBarProps> = ({ query, onSearch }) => {
  return (
    <View style={styles.searchContainer}>
      {/* Display search icon */}
      <Icon name="search" size={24} color="gray" style={styles.searchIcon} />
      {/* Input field for search queries */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a movie..."
        value={query}
        onChangeText={onSearch}
      />
    </View>
  );
};

export default SearchBar;
