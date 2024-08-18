import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Modal, TextInput, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { savePurchasesDate, fetchProduct, fetchDiscount } from '../api/purchaseApi'; // savePurchasesDate 추가
import { colors } from '../constants/color';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { stackNavigations } from '../constants';

interface PurchaseProductDto {
  productName: string;
  count: number;
  totalPrice: number;
}

interface Product {
  id: number;
  productName: string;
  productPrice: number;
}

interface Discount {
  discountId: number;
  discountType: string; // 할인률이 문자열로 전달됨
}

function applyDiscountToProduct(product: Product, discount: Discount | undefined): number {
  if (discount) {
    const discountPercentage = parseFloat(discount.discountType.replace('%', '')) / 100;
    return Math.round(product.productPrice * (1 - discountPercentage));
  }
  return product.productPrice;
}

function PurchasesAdd() {
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [count, setCount] = useState<number>(1);
  const [addedProducts, setAddedProducts] = useState<PurchaseProductDto[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadProductsAndDiscounts = async () => {
      const fetchedProducts = await fetchProduct();
      const fetchedDiscounts = await fetchDiscount();
      setProducts(fetchedProducts);
      setDiscounts(fetchedDiscounts);
    };
    loadProductsAndDiscounts();
  }, []);

  const handleAddProduct = () => {
    if (selectedProduct) {
      const discount = discounts.find(d => d.discountId === selectedProduct.id);
      const discountedPrice = applyDiscountToProduct(selectedProduct, discount);

      const newProduct: PurchaseProductDto = {
        productName: selectedProduct.productName,
        count,
        totalPrice: discountedPrice * count,
      };
      setAddedProducts((prev) => [...prev, newProduct]);
      setSelectedProduct(null); // Reset after adding
    }
  };

  const handleSavePurchases = async () => {
    const purchase_date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Calculate totalPrice
    const totalPrice = addedProducts.reduce((sum, item) => sum + item.totalPrice, 0);

    // Create data object in expected format
    const dataToSend = {
      purchaseProduct: addedProducts,
      totalPrice: totalPrice,
    };

    await savePurchasesDate(dataToSend, purchase_date);
    navigation.reset({
      index: 0,
      routes: [{ name: stackNavigations.MAIN }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>상품 선택</Text>

        <Pressable onPress={() => setModalVisible(true)} style={styles.selectButton}>
          <Text style={styles.selectButtonText}>
            {selectedProduct ? selectedProduct.productName : '상품을 선택하세요'}
          </Text>
        </Pressable>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <FlatList
                    data={products}
                    renderItem={({ item }) => (
                      <Pressable
                        style={styles.modalItem}
                        onPress={() => {
                          setSelectedProduct(item);
                          setModalVisible(false);
                        }}
                      >
                        <Text>{item.productName}</Text>
                      </Pressable>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Text style={styles.title}> 수량 </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="수량"
          value={String(count)}
          onChangeText={(text) => setCount(Number(text))}
        />

        <Pressable style={styles.addButton} onPress={handleAddProduct}>
          <Icon name="add" size={40} color={colors.BLUE_300} />
        </Pressable>

        <FlatList
          data={addedProducts}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Text>{item.productName} x {item.count}</Text>
              <Text>{item.totalPrice.toLocaleString()}원</Text>
            </View>
          )}
          keyExtractor={(item, index) => `${item.productName}-${index}`}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>

      <Pressable style={styles.saveButton} onPress={handleSavePurchases}>
        <Text style={styles.saveButtonText}>추가 완료</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  selectButton: {
    padding: 10,
    backgroundColor: colors.GRAY_200,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: colors.GRAY_500,
    borderWidth: 1,
  },
  selectButtonText: {
    fontSize: 16,
    color: colors.BLACK,
  },
  input: {
    height: 40,
    borderColor: colors.GRAY_300,
    borderWidth: 1,
    borderRadius : 10,
    paddingHorizontal: 8,
  },
  addButton: {
    padding: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.WHITE,
    fontSize: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_200,
  },
  saveButton: {
    backgroundColor: colors.BLUE_250,
    margin :15,
    padding: 15,
    borderRadius : 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.WHITE,
    fontSize: 16,
  },
  flatListContainer: {
    paddingBottom: 16, // Ensures there's space at the bottom of the list
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_200,
  },
});

export default PurchasesAdd;
