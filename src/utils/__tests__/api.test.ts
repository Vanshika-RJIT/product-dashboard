import { api } from '../api';
import { Product } from '../../types';

jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
  },
  __esModule: true,
}));

const axios = require('axios');
const mockedAxios = axios.default;

describe('api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('fetches all products', async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Test Product',
          price: 99.99,
          description: 'Test',
          category: 'electronics',
          image: 'test.jpg',
          rating: { rate: 4.5, count: 100 },
        },
      ];

      mockedAxios.get.mockResolvedValue({ data: mockProducts });

      const result = await api.getProducts();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products');
      expect(result).toEqual(mockProducts);
    });

    it('handles errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(api.getProducts()).rejects.toThrow('Network error');
    });
  });

  describe('getProduct', () => {
    it('fetches single product', async () => {
      const mockProduct: Product = {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        description: 'Test',
        category: 'electronics',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 100 },
      };

      mockedAxios.get.mockResolvedValue({ data: mockProduct });

      const result = await api.getProduct(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getCategories', () => {
    it('fetches all categories', async () => {
      const mockCategories = ['electronics', 'clothing'];

      mockedAxios.get.mockResolvedValue({ data: mockCategories });

      const result = await api.getCategories();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/categories');
      expect(result).toEqual(mockCategories);
    });
  });
});
