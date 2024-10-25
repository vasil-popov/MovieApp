import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AccessToken } from 'react-native-fbsdk-next';
import { Stack, useRootNavigationState } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData, initializeFacebookSDK } from './facebookApi';
import { usePushNotifications } from './usePushNotifications';

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notificationData, setNotificationData] = useState(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const { expoPushToken } = usePushNotifications(userEmail);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeFacebookSDK();
        
        const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();
        if (lastNotificationResponse) {
          const { movieId, screen } = lastNotificationResponse.notification.request.content.data;
          if (screen === 'MovieDetails' && movieId) {
            setNotificationData({ movieId, screen });
          }
        }

        const token = await AccessToken.getCurrentAccessToken();
        setIsAuthenticated(!!token);

        if (token) {
          const userInfo = await getUserData(token.accessToken);
          console.log('User Info:', userInfo); 
          setUserEmail(userInfo?.email || null); 


          if (expoPushToken) {
            await AsyncStorage.setItem('push_token', expoPushToken);
          }
        }
      } catch (error) {
        console.log('Error during initialization', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); 
      }
    };

    initializeApp();
  }, [expoPushToken]); 

  useEffect(() => {
    const notificationListener = Notifications.addNotificationResponseReceivedListener(response => {
      const { movieId, screen } = response.notification.request.content.data;
      if (screen === 'MovieDetails' && movieId) {
        router.push(`/movie-details/${movieId}`);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, [router]);

  useEffect(() => {
    const checkInitialNotification = async () => {
      const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();
      if (lastNotificationResponse) {
        const { movieId, screen } = lastNotificationResponse.notification.request.content.data;
        if (screen === 'MovieDetails' && movieId) {
          router.replace(`/movie-details/${movieId}`);
        }
      }
    };
  
    checkInitialNotification();
  }, [navigationState?.key, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        if (notificationData) {
          router.replace(`/movie-details/${notificationData.movieId}`);
        } else if (isAuthenticated) {
          router.replace('/(tabs)/movie-list'); 
        } else {
          router.replace('/');
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, notificationData, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="index" />
      )}
    </Stack>
  );
}
