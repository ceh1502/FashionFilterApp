import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import products from '../data/products.json';

// Image map for local images
const imageMap = {
  "top_black_1.webp": require('../assets/images/top_black_1.webp'),
  "top_black_2.webp": require('../assets/images/top_black_2.webp'),
  "top_black_3.webp": require('../assets/images/top_black_3.webp'),
  "top_black_4.webp": require('../assets/images/top_black_4.webp'),
  "top_white_1.webp": require('../assets/images/top_white_1.webp'),
  "top_white_2.webp": require('../assets/images/top_white_2.webp'),
  "top_white_3.webp": require('../assets/images/top_white_3.webp'),
  "top_white_4.webp": require('../assets/images/top_white_4.webp'),
  "btm_1.webp": require('../assets/images/btm_1.webp'),
  "btm_2.webp": require('../assets/images/btm_2.webp'),
  "btm_3.webp": require('../assets/images/btm_3.webp'),
  "btm_4.webp": require('../assets/images/btm_4.webp'),
  "shoe_1.webp": require('../assets/images/shoe_1.webp'),
  "shoe_2.webp": require('../assets/images/shoe_2.webp'),
};

function CodiScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('상의');
  const [selectedColor, setSelectedColor] = useState(null);

  const filteredProducts = products.filter(product => {
    const categoryMatch = product.category === selectedCategory;
    const colorMatch = selectedColor ? product.color === selectedColor : true;
    return categoryMatch && colorMatch;
  });

  const handleProductPress = (product) => {
    console.log('상품 클릭:', product);
  };

  const renderProduct = (product) => (
    <TouchableOpacity 
      key={product.id} 
      style={codiStyles.productCard}
      onPress={() => handleProductPress(product)}
    >
      <Image source={imageMap[product.image]} style={codiStyles.productImage} />
      <View style={codiStyles.productInfo}>
        <Text style={codiStyles.brandText}>{product.brand}</Text>
        <Text style={codiStyles.productName}>{product.name}</Text>
        <Text style={codiStyles.priceText}>{product.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={codiStyles.container}>
      <View style={codiStyles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
          <Text style={codiStyles.headerTitle}>뮤신샤</Text>
        </TouchableOpacity>
      </View>

      <View style={codiStyles.categorySection}>
        <Text style={codiStyles.filterLabel}>종류</Text>
        <View style={codiStyles.categoryContainer}>
          {['상의', '하의', '신발'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                codiStyles.categoryButton,
                selectedCategory === category && codiStyles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                codiStyles.categoryText,
                selectedCategory === category && codiStyles.selectedCategoryText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={codiStyles.moreButton}>
            <Text style={codiStyles.moreText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={codiStyles.colorSection}>
        <Text style={codiStyles.filterLabel}>색상</Text>
        <View style={codiStyles.colorContainer}>
          {[
            { name: '검정', color: '#000000' },
            { name: '흰색', color: '#FFFFFF' },
            { name: '베이지', color: '#F5F5DC' },
            { name: '핑크', color: '#FFC0CB' },
          ].map((colorItem) => (
            <TouchableOpacity
              key={colorItem.name}
              style={[
                codiStyles.colorButton,
                { backgroundColor: colorItem.color },
                colorItem.color === '#FFFFFF' && codiStyles.whiteColorBorder,
                selectedColor === colorItem.name && codiStyles.selectedColorButton
              ]}
              onPress={() => setSelectedColor(
                selectedColor === colorItem.name ? null : colorItem.name
              )}
            />
          ))}
          <TouchableOpacity style={codiStyles.moreButton}>
            <Text style={codiStyles.moreText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={codiStyles.productSection}>
        <Text style={codiStyles.filterLabel}>제품</Text>
        <TouchableOpacity style={codiStyles.moreButton}>
          <Text style={codiStyles.moreText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={codiStyles.scrollView}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={codiStyles.scrollContent}
      >
        <View style={codiStyles.productsGrid}>
          {filteredProducts.map(renderProduct)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const codiStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
  },
  categorySection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategoryButton: {
    backgroundColor: '#000',
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1.0,
    shadowRadius: 6,
    elevation: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  colorSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  whiteColorBorder: {
    borderColor: '#ddd',
  },
  selectedColorButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1.0,
    shadowRadius: 6,
    elevation: 8,
  },
  productSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  moreButton: {
    padding: 5,
  },
  moreText: {
    fontSize: 16,
    color: '#666',
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
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  productInfo: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  brandText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});


export default CodiScreen;