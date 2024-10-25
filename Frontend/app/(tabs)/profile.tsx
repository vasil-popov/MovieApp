// ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LoginButton, LoginManager } from 'react-native-fbsdk-next';
import { initializeFacebookSDK, getAccessToken, getUserData } from '../facebookApi';

export default function ProfileScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string; picture?: string }>({});
  const [isSDKInitialized, setIsSDKInitialized] = useState(false);

  useEffect(() => {
    const setupFacebook = async () => {
      await initializeFacebookSDK();
      setIsSDKInitialized(true);

      const accessToken = await getAccessToken();
      if (accessToken) {
        const userData = await getUserData(accessToken);
        if (userData) setUserInfo(userData);
      }
    };
    setupFacebook();
  }, []);

  const handleLoginFinished = async () => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const userData = await getUserData(accessToken);
      if (userData) setUserInfo(userData);
    }
  };

  const handleLogout = () => {
    LoginManager.logOut();
    setUserInfo({});
    router.push('/');
  };

  if (!isSDKInitialized) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {userInfo.picture ? (
        <Image source={{ uri: userInfo.picture }} style={styles.profileImage} />
      ) : (
        <Text style={styles.placeholder}>No picture</Text>
      )}

      <Text style={styles.heading}>Profile</Text>
      <View style={styles.profileContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userInfo.name || 'N/A'}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userInfo.email || 'N/A'}</Text>
      </View>

      <LoginButton
        onLoginFinished={handleLoginFinished}
        onLogoutFinished={handleLogout}
        permissions={['public_profile', 'email']}
        style={styles.loginButton}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 200,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 150,
    width: 200, 
    height: 30,
  }
});
