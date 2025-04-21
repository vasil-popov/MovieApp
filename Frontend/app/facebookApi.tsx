import { AccessToken, Settings } from 'react-native-fbsdk-next';

interface UserInfo {
  id: string;
  name: string;
  email?: string;
  picture: string;
}

export const initializeFacebookSDK = async (): Promise<void> => {
  try {
    await Settings.initializeSDK();
    console.log('Facebook SDK initialized');
  } catch (error) {
    console.log('Failed to initialize Facebook SDK', error);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  const data = await AccessToken.getCurrentAccessToken();
  return data ? data.accessToken : null;
};

export const getUserData = async (accessToken: string): Promise<UserInfo | null> => {
  try {
    const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`);
    const result = await response.json();
    if (result.error) {
      console.log('Error fetching user data:', result.error);
      return null;
    }
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      picture: result.picture.data.url,
    };
  } catch (error) {
    console.log('Error in fetching user data:', error);
    return null;
  }
};
