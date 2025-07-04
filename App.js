import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import LandingScreen from './src/screens/LandingScreen';

// 임시 CodiScreen 컴포넌트
function CodiScreen({ navigation }) {
  return (
    <SafeAreaView style={codiStyles.container}>
      <View style={codiStyles.header}>
        <TouchableOpacity 
          style={codiStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={codiStyles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={codiStyles.headerTitle}>코디 추천</Text>
      </View>

      <View style={codiStyles.content}>
        <Text style={codiStyles.title}>코디 페이지</Text>
        <Text style={codiStyles.subtitle}>스타일링 추천 기능이 들어갈 예정입니다!</Text>
        
        <View style={codiStyles.placeholder}>
          <Text style={codiStyles.placeholderText}>🎨</Text>
          <Text style={codiStyles.placeholderSubText}>코디 추천 기능 개발 예정</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const codiStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 50,
  },
  placeholder: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 50,
    marginBottom: 15,
  },
  placeholderSubText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

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