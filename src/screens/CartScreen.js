import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context/CartContext';

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
  "AI_Classic_Rop.jpeg": require('../assets/images/AI_Classic_Rop.jpeg'),
  "AI_Dark_Jeans.jpeg": require('../assets/images/AI_Dark_Jeans.jpeg'),
  "AI_Fit_T.jpeg": require('../assets/images/AI_Fit_T.jpeg'),
  "AI_Overfit_Hood.jpeg": require('../assets/images/AI_Overfit_Hood.jpeg'),
  "AI_Running_Sneakers2.jpeg": require('../assets/images/AI_Running_Sneakers2.jpeg'),
  "AI_Slim_Boots.jpeg": require('../assets/images/AI_Slim_Boots.jpeg'),
  "AI_slim1.jpeg": require('../assets/images/AI_slim1.jpeg'),
  "AI_Sneakers.jpeg": require('../assets/images/AI_Sneakers.jpeg'),
  "AI_Straight_Jeans.jpeg": require('../assets/images/AI_Straight_Jeans.jpeg'),
  "AI_Tai_Pants.jpeg": require('../assets/images/AI_Tai_Pants.jpeg'),
  "AI_V.jpeg": require('../assets/images/AI_V.jpeg'),
  "AI_Wide_Kago.jpeg": require('../assets/images/AI_Wide_Kago.jpeg'),
};

function CartScreen({ navigation }) {
  const { cartItems, clearCart } = useCart();
  const [orderCompleteModalVisible, setOrderCompleteModalVisible] = useState(false);

  // Load cart items when component mounts
  useEffect(() => {
    // loadCartItems(); // This function is no longer needed
  }, []);

  // Reload cart when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // loadCartItems(); // This function is no longer needed
    });

    return unsubscribe;
  }, [navigation]);

  // const loadCartItems = async () => { // This function is no longer needed
  //   try {
  //     const savedCart = await AsyncStorage.getItem('cart');
  //     if (savedCart) {
  //       setCartItems(JSON.parse(savedCart));
  //     }
  //   } catch (error) {
  //     console.error('Error loading cart:', error);
  //   }
  // };

  // const saveCartItems = async (newCart) => { // This function is no longer needed
  //   try {
  //     await AsyncStorage.setItem('cart', JSON.stringify(newCart));
  //   } catch (error) {
  //     console.error('Error saving cart:', error);
  //   }
  // };

  const removeFromCart = (itemId) => {
    Alert.alert(
      '상품 삭제',
      '이 상품을 장바구니에서 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => {
            // const newCart = cartItems.filter(item => item.id !== itemId); // This logic is now handled by context
            // setCartItems(newCart); // This logic is now handled by context
            // saveCartItems(newCart); // This logic is now handled by context
          }
        }
      ]
    );
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    // const newCart = cartItems.map(item => // This logic is now handled by context
    //   item.id === itemId ? { ...item, quantity: newQuantity } : item
    // );
    // setCartItems(newCart); // This logic is now handled by context
    // saveCartItems(newCart); // This logic is now handled by context
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const handleOrderComplete = () => {
    setOrderCompleteModalVisible(true); // Show the modal
    clearCart(); // Clear the cart
  };

  const closeOrderCompleteModal = () => {
    setOrderCompleteModalVisible(false);
    // Clear the cart after order completion
    // setCartItems([]); // This logic is now handled by context
    // saveCartItems([]); // This logic is now handled by context
  };

  const renderCartItem = (item) => (
    <View key={item.id} style={cartStyles.cartItem}>
      <Image source={imageMap[item.image]} style={cartStyles.itemImage} />
      <View style={cartStyles.itemInfo}>
        <Text style={cartStyles.itemBrand}>{item.brand}</Text>
        <Text style={cartStyles.itemName}>{item.name}</Text>
        <Text style={cartStyles.itemColor}>색상: {item.color}</Text>
        <Text style={cartStyles.itemPrice}>{item.price}</Text>
        
        <View style={cartStyles.quantityContainer}>
          <TouchableOpacity 
            style={cartStyles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={cartStyles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity 
            style={cartStyles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={cartStyles.removeButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={cartStyles.container}>
      <View style={cartStyles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
          <Text style={cartStyles.headerCenter}>뮤신샤</Text>
        </TouchableOpacity>
        <Text style={cartStyles.headerTitle}>장바구니</Text>
        <Text style={cartStyles.itemCount}>{getTotalItems()}개 상품</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={cartStyles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={cartStyles.emptyText}>장바구니가 비어있습니다</Text>
          <TouchableOpacity 
            style={cartStyles.shopButton}
            onPress={() => navigation.navigate('Codi')}
          >
            <Text style={cartStyles.shopButtonText}>쇼핑하러 가기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={cartStyles.scrollView}>
            {cartItems.map(renderCartItem)}
          </ScrollView>
          
          <View style={cartStyles.footer}>
            <View style={cartStyles.totalContainer}>
              <Text style={cartStyles.totalLabel}>총 {getTotalItems()}개 상품</Text>
              <Text style={cartStyles.totalPrice}>₩{getTotalPrice().toLocaleString()}</Text>
            </View>
            <TouchableOpacity 
              style={cartStyles.checkoutButton}
              onPress={handleOrderComplete}
            >
              <Text style={cartStyles.checkoutButtonText}>주문하기</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Order Complete Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={orderCompleteModalVisible}
        onRequestClose={closeOrderCompleteModal}
      >
        <View style={cartStyles.modalOverlay}>
          <View style={cartStyles.modalContent}>
            <View style={cartStyles.modalIconContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
            </View>
            <Text style={cartStyles.modalTitle}>주문이 완료되었습니다</Text>
            <Text style={cartStyles.modalSubtitle}>
              주문해주셔서 감사합니다!{'\n'}
              주문 내역은 이메일로 발송됩니다.
            </Text>
            <TouchableOpacity 
              style={cartStyles.modalButton}
              onPress={closeOrderCompleteModal}
            >
              <Text style={cartStyles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const cartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000000',
  },
  headerCenter: {
    color: '#FFFFFF',
    fontSize: 14,
//    fontWeight: 'bold',
    marginTop: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemCount: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 10,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemBrand: {
    fontSize: 12,
    color: '#999',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemColor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 10,
    justifyContent: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  checkoutButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen; 