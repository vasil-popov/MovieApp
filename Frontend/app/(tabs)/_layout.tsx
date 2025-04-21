import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#E50914',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#1a1a1a',
          borderBottomColor: '#333',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen 
        name="movie-list" 
        options={{
          title: 'Movies',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film-outline" color={color} size={size} /> 
          ),
          tabBarLabel: 'Филми',
          headerTitle: 'Каталог на филми',
        }} 
      />
      <Tabs.Screen 
        name="favorites" 
        options={{
          title: 'Любими',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} /> 
          ),
          tabBarLabel: 'Любими',
          headerShown: false,
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Профил',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} /> 
          ),
          tabBarLabel: 'Профил',
          headerShown: false,
        }} 
      />
    </Tabs>
  );
}
