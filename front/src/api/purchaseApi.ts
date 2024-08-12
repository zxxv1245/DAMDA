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
  const response = await axiosInstance.get(`/api/v1/myPurchase/${purchase_date}`, {
    headers: {
      'Requires-Auth': 'true',
    },
  });
  return response.data.data;
};

const fetchPurchaseDates = async (year: number, month: number): Promise<string[]> => {
  const response = await axiosInstance.get(`/api/v1/myPurchase/${year}/${month}/dates`, {
    headers: {
      'Requires-Auth': 'true',
    },
  });
  return response.data.data;
};

const fetchTotalPriceByMonth = async (year: number, month: number): Promise<number> => {
  const response = await axiosInstance.get(`/api/v1/myPurchase/${year}/${month}`, {
    headers: {
      'Requires-Auth': 'true',
    },
  });
  return response.data.data;
};

const fetchRecentPurchases = async () => {
  const response = await axiosInstance.get('/api/v1/myPurchase/recent', {
    headers: {
      'Requires-Auth': 'true',
    },
  });
  return response.data.data;
};

const savePurchases = async (Data: PurchaseProductDto[]): Promise<void> => {
  await axiosInstance.post('/api/v1/myPurchase/savePurchase', Data, {
    headers: {
      'Requires-Auth': 'true',
      'Content-Type': 'application/json',
    },
  });
};

export { fetchPurchases, fetchPurchaseDates, fetchTotalPriceByMonth, fetchRecentPurchases, savePurchases };
