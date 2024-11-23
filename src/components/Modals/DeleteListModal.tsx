import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import MyText from "@/src/components/TextOutput/TextOutput";
import { createStyles } from "../../screens/MyMoviesScreen/MyMoviesScreen.styles";

interface DeleteListModalProps {
  popupVisible: boolean; // Controls the visibility of the delete list modal
  setPopupVisible: (visible: boolean) => void; // Function to toggle the visibility of the modal
  confirmDeleteList: () => void; // Function to confirm the deletion of a list
  style?: object; // Optional style prop for customizing modal appearance
}

const DeleteListModal: React.FC<DeleteListModalProps> = ({
  popupVisible,
  setPopupVisible,
  confirmDeleteList,
  style,
}) => {
  const { colors } = useTheme(); // Get theme colors for consistent styling
  const styles = createStyles(colors); // Create styles based on theme

  return (
    <Modal
      animationType="fade" // Fade animation for better user experience
      transparent={true} // Background behind modal is transparent
      visible={popupVisible} // Control visibility of modal
      onRequestClose={() => setPopupVisible(false)} // Close modal when user requests it (e.g., back button)
    >
      <TouchableWithoutFeedback onPress={() => setPopupVisible(false)}>
        <View style={[styles.modalOverlay]}>
          {/* Use the overlay style to create a dark transparent background */}
          <TouchableWithoutFeedback>
            <View
              style={[styles.modalContent, styles.smallModalContent, style]}
            >
              {/* Smaller modal for delete confirmation */}
              <MyText
                size="large"
                style={[styles.headerText, { marginBottom: 15 }]}
              >
                Options
              </MyText>
              <View style={styles.optionsContainer}>
                {/* Container for delete and cancel buttons */}
                <TouchableOpacity
                  style={styles.deleteButton} // Style for delete button
                  onPress={confirmDeleteList} // Trigger delete confirmation on press
                >
                  <MyText size="medium" style={{ color: "white" }}>
                    {/* Text style inside delete button */}
                    Delete
                  </MyText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton} // Style for cancel button
                  onPress={() => setPopupVisible(false)} // Close modal on press
                >
                  <MyText size="medium" style={{ color: "white" }}>
                    {/* Text style inside cancel button */}
                    Cancel
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

export default DeleteListModal;
