import * as SecureStore from 'expo-secure-store';

// Saving a token
export const saveToken = async (token: string, refreshToken: string, tokenExpiration?, refreshTokenExpiration?): Promise<void> => {
  await SecureStore.setItemAsync('userToken', token);
  await SecureStore.setItemAsync('refreshToken', refreshToken || '');

  if (tokenExpiration) {
    await SecureStore.setItemAsync('tokenExpiration', tokenExpiration);
  }
  else {
    // set the expiration to 24 hours from now
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24);
    await SecureStore.setItemAsync('tokenExpiration', expiration.toISOString());
  }

  if (refreshTokenExpiration) {
    await SecureStore.setItemAsync('refreshTokenExpiration', refreshTokenExpiration);
  }
  else {
    // set the expiration to 1 year from now
    const expiration = new Date();
    expiration.setFullYear(expiration.getFullYear() + 1);
    await SecureStore.setItemAsync('refreshTokenExpiration', expiration.toISOString());
  }
};

// Retrieving a token
export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('userToken');
};

// Retrieving a refresh token
export const getRefreshToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('refreshToken');
};

// Deleting a token
export const deleteToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('userToken');
  await SecureStore.deleteItemAsync('refreshToken');
};
