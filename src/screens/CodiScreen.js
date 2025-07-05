import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

function CodiScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('상의');
  const [selectedColor, setSelectedColor] = useState(null);

  const products = [
    { id: 1, name: '베이직 티셔츠', brand: '브랜드', category: '상의', color: '검정', price: '29,000원' },
    { id: 2, name: '크롭 티셔츠', brand: '브랜드', category: '상의', color: '흰색', price: '25,000원' },
    { id: 3, name: '오버핏 셔츠', brand: '브랜드', category: '상의', color: '베이지', price: '39,000원' },
    { id: 4, name: '니트 스웨터', brand: '브랜드', category: '상의', color: '핑크', price: '45,000원' },
    { id: 5, name: '데님 자켓', brand: '브랜드', category: '상의', color: '검정', price: '89,000원' },
    { id: 6, name: '후드 티셔츠', brand: '브랜드', category: '상의', color: '검정', price: '55,000원' },
    { id: 7, name: '슬림 진', brand: '브랜드', category: '하의', color: '검정', price: '79,000원' },
    { id: 8, name: '와이드 팬츠', brand: '브랜드', category: '하의', color: '베이지', price: '65,000원' },
    { id: 9, name: '치노 팬츠', brand: '브랜드', category: '하의', color: '검정', price: '59,000원' },
    { id: 10, name: '트레이닝 팬츠', brand: '브랜드', category: '하의', color: '흰색', price: '45,000원' },
    { id: 11, name: '스니커즈', brand: '브랜드', category: '신발', color: '흰색', price: '129,000원' },
    { id: 12, name: '로퍼', brand: '브랜드', category: '신발', color: '검정', price: '149,000원' },
  ];

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
      <View style={codiStyles.productImage}>
        <Text style={codiStyles.placeholderText}>이미지</Text>
      </View>
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
        <TouchableOpacity 
          style={codiStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={codiStyles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={codiStyles.headerTitle}>무신사</Text>
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
        showsVerticalScrollIndicator={false}
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
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
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
    borderColor: '#000',
    borderWidth: 3,
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