// purchaseApi.ts
import { getEncryptedStorage } from '../utils';
import axiosInstance from './axios';

interface PurchaseProductDto {
  productName: string;
  count: number;
  totalPrice: number;
}

interface PurchaseResponseDto {
  id: string;
  purchaseDate: string;
  purchaseProducts: PurchaseProductDto[];
  totalPrice: number;
}

const fetchPurchases = async (purchase_date: string): Promise<PurchaseResponseDto[]> => {
  try {
    const token = await getEncryptedStorage('accessToken');
    const response = await axiosInstance.get(`/api/v1/myPurchase/${purchase_date}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching purchases:', error);
    throw error;
  }
};

const fetchPurchaseDates = async (year: number, month: number): Promise<string[]> => {
  try {
    const token = await getEncryptedStorage('accessToken');
    const response = await axiosInstance.get(`/api/v1/myPurchase/${year}/${month}/dates`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching purchase dates:', error);
    throw error;
  }
};

const fetchTotalPriceByMonth = async (year: number, month: number): Promise<number> => {
  try {
    const token = await getEncryptedStorage('accessToken');
    const response = await axiosInstance.get(`/api/v1/myPurchase/${year}/${month}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching total price:', error);
    throw error;
  }
};

export { fetchPurchases, fetchPurchaseDates, fetchTotalPriceByMonth };
