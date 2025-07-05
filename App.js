import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity,ScrollView } from 'react-native';
import LandingScreen from './src/screens/LandingScreen';
import CodiScreen from './src/screens/CodiScreen';
import BodyTypeScreen from './src/screens/BodyTypeScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('Landing');

  const navigation = {
    navigate: (screenName) => setCurrentScreen(screenName),
    goBack: () => setCurrentScreen('Landing'),
  };

  if (currentScreen === 'Landing') {
    return <LandingScreen navigation={navigation} />;
  } else if (currentScreen === 'Codi') {
    return <CodiScreen navigation={navigation} />;
  }
  
  return <LandingScreen navigation={navigation} />;
}

export default App;