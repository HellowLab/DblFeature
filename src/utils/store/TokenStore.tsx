import * as SecureStore from 'expo-secure-store';

// Saving a token
export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync('userToken', token);
};

// Retrieving a token
export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('userToken');
};

// Deleting a token
export const deleteToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('userToken');
};
