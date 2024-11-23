import React, { useState, useEffect } from "react";
import {
  Modal, // Component to display the modal dialog
  View, // Basic container for layout and styling
  TextInput, // Input field for entering text
  TouchableOpacity, // Button with touch feedback
  TouchableWithoutFeedback, // Wrapper to handle dismiss actions outside the modal
} from "react-native";
import { useTheme } from "@react-navigation/native";
import MyText from "@/src/components/TextOutput/TextOutput";
import { createStyles } from "../../screens/MyMoviesScreen/MyMoviesScreen.styles";

// Define the type for props passed to the CreateListModal component
interface CreateListModalProps {
  newListModalVisible: boolean; // Determines if the modal is visible
  setNewListModalVisible: (visible: boolean) => void; // Function to toggle modal visibility
  handleCreateNewList: (
    name: string, // Name of the new list
    description: string, // Description for the new list
    autoAddMovie?: boolean // Optional flag to auto-add a movie
  ) => void;
  isAutoAddingToNewList: boolean; // Flag indicating if a movie should be auto-added to the new list
}

// Functional component for the CreateListModal
const CreateListModal: React.FC<CreateListModalProps> = ({
  newListModalVisible, // Visibility state of the modal
  setNewListModalVisible, // Function to set modal visibility
  handleCreateNewList, // Callback to handle list creation
  isAutoAddingToNewList, // Indicates if auto-add is enabled
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // State to track the name of the new list being created
  const [newListName, setNewListName] = useState("");
  // State to track the description of the new list being created
  const [newListDescription, setNewListDescription] = useState("");

  // Effect to reset input fields when the modal is closed
  useEffect(() => {
    if (!newListModalVisible) {
      setNewListName(""); // Clear the list name
      setNewListDescription(""); // Clear the list description
    }
  }, [newListModalVisible]); // Dependency: Re-run when modal visibility changes

  // Handler for creating a new list
  const onCreateNewList = () => {
    if (newListName.trim()) {
      // Call the handler passed from the parent component with the input values
      handleCreateNewList(
        newListName, // Name of the new list
        newListDescription, // Description of the new list
        isAutoAddingToNewList // Whether to auto-add a movie
      );
      setNewListModalVisible(false); // Close the modal after creation
    }
  };

  // Render the modal
  return (
    <Modal
      animationType="fade" // Modal animation style
      transparent={true} // Makes the modal background transparent
      visible={newListModalVisible} // Controls modal visibility
      onRequestClose={() => setNewListModalVisible(false)} // Handle hardware back button (Android)
    >
      {/* Dismiss the modal when tapping outside */}
      <TouchableWithoutFeedback onPress={() => setNewListModalVisible(false)}>
        <View style={styles.modalOverlay}>
          {/* Prevent dismissing when interacting with modal content */}
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { paddingVertical: 20 }]}>
              {/* Header Section */}
              <MyText
                size="large"
                style={[styles.headerText, { marginBottom: 10 }]} // Styled header text
              >
                Create New List
              </MyText>
              {/* Input Fields Section */}
              <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
                {/* Input for the list name */}
                <TextInput
                  placeholder="List Name" // Placeholder text for the input
                  placeholderTextColor={colors.primary} // Styled placeholder color
                  value={newListName} // Controlled input value
                  onChangeText={setNewListName} // Update state on text change
                  style={styles.input} // Input styling
                />
                {/* Input for the list description */}
                <TextInput
                  placeholder="Description (Optional)" // Placeholder for optional description
                  placeholderTextColor={colors.primary} // Styled placeholder color
                  value={newListDescription} // Controlled input value
                  onChangeText={setNewListDescription} // Update state on text change
                  style={[styles.input, { marginTop: 10 }]} // Additional margin for spacing
                />
              </View>
              {/* Footer Section with Create Button */}
              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={onCreateNewList} // Trigger the list creation
                  style={styles.createNewListButton} // Styled button
                >
                  <MyText size="large" style={{ color: colors.primary }}>
                    + Create New List
                  </MyText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateListModal;
