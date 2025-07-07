import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import CodiScreen from '../screens/CodiScreen';
import BodyTypeScreen from '../screens/BodyTypeScreen';
import LandingScreen from '../screens/LandingScreen';
import CartScreen from '../screens/CartScreen';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    loadCartItemCount();
  }, []);

  const loadCartItemCount = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(totalItems);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

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
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ position: 'relative', marginTop: 4 }}>
              <Ionicons name="cart-outline" size={28} color={focused ? "#000" : "#aaa"} />
              {cartItemCount > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  backgroundColor: '#ff4444',
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            loadCartItemCount();
          },
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
