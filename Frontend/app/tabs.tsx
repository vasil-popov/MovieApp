import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import MovieListScreen from './(tabs)/movie-list'; 
import ProfileScreen from './(tabs)/profile'; 

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="MovieList"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName: 'film' | 'user' = route.name === 'movie-list' ? 'film' : 'user';

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {}
      <Tab.Screen
        name="MovieList"
        component={MovieListScreen}
        options={{ title: 'Movies' }}
      />
      
      {}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
