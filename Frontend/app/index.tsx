import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ImageBackground  } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk-next';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('fb_access_token');
        if (accessToken) {
          console.log('User is already logged in, redirecting to movie list');
          router.push('/(tabs)/movie-list');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLoginFinished = (error: any, result: any) => {
    if (error) {
      console.error('Login failed with error: ' + error);
    } else if (result.isCancelled) {
      console.log('Login was cancelled');
    } else {
      AccessToken.getCurrentAccessToken().then(async (data) => {
        if (data) {
          console.log('Logged in!', data);
          await AsyncStorage.setItem('fb_access_token', data.accessToken);
          router.push('/(tabs)/movie-list');
        }
      });
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('fb_access_token');
      console.log('Logged out and token removed');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f562aaf4-5dbb-4603-a32b-6ef6c2230136/dh0w8qv-9d8ee6b2-b41a-4681-ab9b-8a227560dc75.jpg/v1/fill/w_1280,h_720,q_75,strp/the_netflix_login_background__canada__2024___by_logofeveryt_dh0w8qv-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvZjU2MmFhZjQtNWRiYi00NjAzLWEzMmItNmVmNmMyMjMwMTM2XC9kaDB3OHF2LTlkOGVlNmIyLWI0MWEtNDY4MS1hYjliLThhMjI3NTYwZGM3NS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.LOYKSxIDqfPwWHR0SSJ-ugGQ6bECF0yO6Cmc0F26CQs' }} 
      style={styles.background}
      resizeMode="cover" 
    >
      <View style={styles.container}>
        <Text style={styles.title}>Добре дошли</Text>
        <Text style={styles.subtitle}>Влезте и разгледайте най-добрите филми!</Text>
        <LoginButton
          onLoginFinished={handleLoginFinished}
          onLogoutFinished={handleLogout}
          style={styles.loginButton}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff', 
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#d3d3d3',
    marginBottom: 30,
  },
  loginButton: {
    width: 200,
    height: 30,
    marginTop: 120,
  },
});

