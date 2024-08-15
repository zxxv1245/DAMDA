// src/api/accountBookApi.ts
import axiosInstance from './axios';

interface Purchase {
  id: string;
  item: string;
  amount: string;
}

const fetchPurchases = async (month: string): Promise<{ [key: string]: Purchase[] }> => {
  const response = await axiosInstance.get(`/api/purchases?month=${month}`);
  
  return response.data;
};


export { fetchPurchases };
