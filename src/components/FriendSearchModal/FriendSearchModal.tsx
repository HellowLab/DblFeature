// components/FriendSearchModal.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchUsers, sendFriendRequest, removeFriendRequest } from '../../utils/APIs/api';

interface FriendSearchModalProps {
  visible: boolean;
  onClose: () => void;
}

const FriendSearchModal: React.FC<FriendSearchModalProps> = ({ visible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<Set<string>>(new Set());

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await searchUsers(query);
        console.log("Search response:", response); // Debug log
        if (response.status === 200) {
          setSearchResults(Array.isArray(response.data) ? response.data : []);
        } else {
          setSearchResults([]);
          console.log("Search failed with status:", response.status);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]); // Clear results if query too short
    }
  };

  const handleFriendAction = async (userId: string, isFriendRequestSent: boolean) => {
    try {
      if (isFriendRequestSent) {
        await removeFriendRequest(userId);
        setFriendRequests(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      } else {
        await sendFriendRequest(userId);
        setFriendRequests(prev => new Set(prev).add(userId));
      }
    } catch (error) {
      console.error("Friend action error:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search for friends..."
        />
        {searchResults.length === 0 && searchQuery.length > 2 ? (
          <Text style={styles.noResults}>No users found</Text>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isFriendRequestSent = friendRequests.has(item.id.toString());
              return (
                <View style={styles.resultItem}>
                  <Text>{item.username}</Text>
                  <TouchableOpacity onPress={() => handleFriendAction(item.id.toString(), isFriendRequestSent)}>
                    <Ionicons
                      name={isFriendRequestSent ? 'remove' : 'add'}
                      size={24}
                      color={isFriendRequestSent ? 'red' : 'green'}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  noResults: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});

export default FriendSearchModal;