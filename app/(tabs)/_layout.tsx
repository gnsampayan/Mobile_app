import { Tabs } from 'expo-router';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Display',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'tv' : 'tv-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="options"
        options={{
          title: 'Picker',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons TabBarIcon name={focused ? 'list' : 'list-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
