import React, { useState } from 'react';
import LandingScreen from './src/screens/LandingScreen';
import BodyTypeScreen from './src/screens/BodyTypeScreen';
import CodiScreen from './src/screens/CodiScreen';

// 임시 CodiScreen 컴포넌트 (나중에 별도 파일로 분리 예정)
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

const codiStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000000',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 5,
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categorySection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  colorSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  productSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  selectedCategoryButton: {
    backgroundColor: '#000000',
  },
  categoryText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  whiteColorBorder: {
    borderColor: '#E0E0E0',
  },
  selectedColorButton: {
    borderColor: '#000000',
    borderWidth: 3,
  },
  moreButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  moreText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#999999',
    fontSize: 14,
  },
  productInfo: {
    paddingHorizontal: 4,
  },
  brandText: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
    fontWeight: '500',
  },
  priceText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
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
  } else if (currentScreen === 'BodyType') {
    return <BodyTypeScreen navigation={navigation} />;
  }
  
  return <LandingScreen navigation={navigation} />;
}

export default App;