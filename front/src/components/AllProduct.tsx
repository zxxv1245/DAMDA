import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { fetchDiscount, fetchProduct } from '../api/purchaseApi';
import { colors } from '../constants/color'; // colors import

interface Product {
  id: number;
  detectName: string | null;
  productAdult: boolean;
  productBarcode: number;
  productDescription: string;
  productImage: string;
  productLocation: string;
  productName: string;
  productPrice: number;
  serialNumber: string;
}

interface Discount {
  discountId: number;
  discountType: string; // 할인률이 문자열로 전달됨
}

function AllProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    const loadProductsAndDiscounts = async () => {
      try {
        const productsData = await fetchProduct();
        const discountsData = await fetchDiscount();
        setProducts(productsData);
        setDiscounts(discountsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    loadProductsAndDiscounts();
  }, []);

  const getDiscountedPrice = (productId: number, originalPrice: number): number => {
    const discount = discounts.find(d => d.discountId === productId);
    if (discount) {
      const discountRate = parseFloat(discount.discountType); // 할인율을 숫자로 변환
      const discountedPrice = originalPrice * (1 - discountRate / 100);
      return Math.round(discountedPrice);
    }
    return originalPrice; // 할인율이 없으면 원래 가격 반환
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>전체 상품 목록</Text>
      {products.length > 0 ? (
        products.map(product => {
          const discountedPrice = getDiscountedPrice(product.id, product.productPrice);
          const isDiscounted = discountedPrice < product.productPrice;

          return (
            <View key={product.id} style={styles.productContainer}>
              <Image source={{ uri: product.productImage }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.productName}</Text>
                <Text style={styles.productDescription}>{product.productDescription}</Text>
                <View style={styles.priceContainer}>
                  {isDiscounted && (
                    <Text style={styles.originalPrice}>{product.productPrice}원</Text>
                  )}
                  <Text style={[styles.productPrice, isDiscounted && styles.discountedPrice]}>
                    {discountedPrice}원
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      ) : (
        <Text>상품이 없습니다.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.GRAY_100, // 배경 색상 설정
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.BLACK, // 텍스트 색상 설정
    marginBottom: 20,
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.GRAY_300, // 테두리 색상 설정
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.WHITE, // 배경 색상 설정
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK, // 텍스트 색상 설정
  },
  productDescription: {
    fontSize: 14,
    color: colors.GRAY_500, // 설명 텍스트 색상 설정
    marginVertical: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 16,
    color: colors.GRAY_500,
    textDecorationLine: 'line-through', // 원래 가격에 중간선 적용
    marginRight: 10,
  },
  productPrice: {
    fontSize: 16,
    color: colors.BLACK, // 기본 가격 색상
  },
  discountedPrice: {
    color: colors.RED_500, // 할인된 가격 색상
  },
});

export default AllProduct;
