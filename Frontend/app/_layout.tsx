import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AccessToken } from 'react-native-fbsdk-next';
import { Stack, useRootNavigationState } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData, initializeFacebookSDK } from './facebookApi';
import { useExpoNotifications } from './useExpoNotifications';
import { StatusBar } from 'expo-status-bar';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationData {
  movieId?: string | number;
  screen?: string;
}

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notificationData, setNotificationData] = useState<NotificationData | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const { expoPushToken, registerForPushNotifications } = useExpoNotifications();

  const registerTokenWithBackend = async (userId: string, token: string) => {
    try {
      const deviceId = await AsyncStorage.getItem('device_id') || `device-${Date.now()}`;
      
      const response = await fetch('http://192.168.1.46:8000/api/notifications/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fbUserId: userId,
          expoPushToken: token,
          deviceId: deviceId,
        }),
      });

      if (response.ok) {
        console.log('Push token registered with backend');
      } else {
        console.error('Failed to register token with backend:', await response.text());
      }
    } catch (error) {
      console.error('Error registering token with backend:', error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeFacebookSDK();
        
        const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();
        if (lastNotificationResponse) {
          const data = lastNotificationResponse.notification.request.content.data as any;
          const movieId = data?.movieId;
          const screen = data?.screen;
          
          if (screen === 'MovieDetails' && movieId) {
            setNotificationData({ movieId, screen });
          }
        }

        const token = await AccessToken.getCurrentAccessToken();
        setIsAuthenticated(!!token);

        if (token) {
          const userInfo = await getUserData(token.accessToken);
          console.log('User Info:', userInfo); 
          const email = userInfo?.email || null;
          const userId = userInfo?.id || null;
          setUserEmail(email); 

          if (userId) {
            const pushToken = await registerForPushNotifications();
            if (pushToken) {
              await AsyncStorage.setItem('push_token', pushToken);
              await registerTokenWithBackend(userId, pushToken);
            }
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
  }, []); 

  useEffect(() => {
    const notificationListener = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as any;
      const movieId = data?.movieId;
      const screen = data?.screen;
      
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
        const data = lastNotificationResponse.notification.request.content.data as any;
        const movieId = data?.movieId;
        const screen = data?.screen;
        
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
        if (notificationData?.movieId) {
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
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#121212' },
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="index" />
        )}
        <Stack.Screen name="movie-details/[id]" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#121212',
  }
});
