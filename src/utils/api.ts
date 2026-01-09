import axios from 'axios';
import { Product } from '../types';

const API_BASE_URL = 'https://fakestoreapi.com';

export const api = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get<Product[]>(`${API_BASE_URL}/products`);
    return response.data;
  },

  // Get single product
  getProduct: async (id: number): Promise<Product> => {
    const response = await axios.get<Product>(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    const response = await axios.get<string[]>(`${API_BASE_URL}/products/categories`);
    return response.data;
  },
};
