import React from 'react';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function CategoriesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#121212',
        },
      }}
    >
      <Stack.Screen
        name="now-playing"
        options={{
          title: 'Сега в кината',
        }}
      />
      <Stack.Screen
        name="popular"
        options={{
          title: 'Популярни',
        }}
      />
      <Stack.Screen
        name="top-rated"
        options={{
          title: 'Най-оценявани',
        }}
      />
      <Stack.Screen
        name="upcoming"
        options={{
          title: 'Предстоящи',
        }}
      />
    </Stack>
  );
} 