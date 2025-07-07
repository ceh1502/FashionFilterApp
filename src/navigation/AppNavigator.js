import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import CodiScreen from '../screens/CodiScreen';
import BodyTypeScreen from '../screens/BodyTypeScreen';
import QuestionScreen from '../screens/QuestionScreen';
import LandingScreen from '../screens/LandingScreen';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabBarIcon({ focused, position }) {
  // Different shapes for left, middle, right (for demo, just position them)
  let style = {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: focused ? '#000' : 'transparent',
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 4,
  };
  // Optionally, you can add more visual difference by position
  return <View style={style} />;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          borderTopWidth: 0.5,
          borderTopColor: '#eee',
        },
      }}
    >
      <Tab.Screen
        name="BodyType"
        component={BodyTypeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="person-outline" size={28} color={focused ? "#000" : "#aaa"} style={{ marginTop: 4 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Codi"
        component={CodiScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="shirt-outline" size={28} color={focused ? "#000" : "#aaa"} style={{ marginTop: 4 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Question"
        component={QuestionScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="heart-outline" size={28} color={focused ? "#000" : "#aaa"} style={{ marginTop: 4 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
