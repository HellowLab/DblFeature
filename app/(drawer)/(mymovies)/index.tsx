import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, Image } from 'react-native';

// Import API functions
import { getMovieResults } from '@/src/utils/APIs/api';

// Import Types
import { MovieResult } from '@/src/utils/types/types';

// Import theme / colors
import { useTheme } from '@react-navigation/native';
import MyText from '@/src/components/TextOutput/TextOutput';

/**
 * Displays list of movies the user has swiped left/right on.
 *
 * @returns {JSX.Element} The rendered component.
 */
const MovieResultsScreen = () => {
  const { colors } = useTheme();
  
  const [movieResults, setMovieResults] = useState<MovieResult[]>([]); // list of movies from api call
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMovieResults = async () => {
    try {
      const response = await getMovieResults();

      // Sort the data by ID in descending order (newest first)
      const sortedData = response.data.sort((a: MovieResult,b: MovieResult) => b.id - a.id)
      setMovieResults(sortedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false); 
    }
  };

  useEffect(() => {
    fetchMovieResults(); // Fetch data when the component mounts
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMovieResults();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <FlatList
        data={movieResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 8, padding: 8, flexDirection: "row", backgroundColor: colors.card }}>
            {item.poster && <Image source={{ uri: item.poster }} style={{ width: 66, height: 99 }} />}
            <View style={{ flex: 1, marginLeft: 10, justifyContent:"space-evenly" }}>
              <MyText size='large'>{item.name}</MyText>
              <MyText size='medium'>{item.liked ? 'Swiped Right -- Liked' : 'Swiped Left -- Not Liked'}</MyText>
            </View>
          </View> 
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

export default MovieResultsScreen;