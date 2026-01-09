import { configureStore } from '@reduxjs/toolkit';
import productsReducer, { fetchProducts, fetchCategories } from '../productsSlice';
import filtersReducer from '../filtersSlice';
import favoritesReducer from '../favoritesSlice';
import { api } from '../../../utils/api';

jest.mock('../../../utils/api', () => ({
  api: {
    getProducts: jest.fn(),
    getCategories: jest.fn(),
  },
}));

describe('productsSlice', () => {
  const createMockStore = () => {
    return configureStore({
      reducer: {
        products: productsReducer,
        filters: filtersReducer,
        favorites: favoritesReducer,
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    const store = createMockStore();
    const state = store.getState().products;
    expect(state).toEqual({
      products: [],
      loading: false,
      error: null,
      categories: [],
    });
  });

  it('should handle fetchProducts.pending', () => {
    const store = createMockStore();
    store.dispatch(fetchProducts.pending('', undefined));
    const state = store.getState().products;
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle fetchProducts.fulfilled', async () => {
    const mockProducts = [
      {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        description: 'Test description',
        category: 'electronics',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 100 },
      },
    ];

    (api.getProducts as jest.Mock).mockResolvedValue(mockProducts);

    const store = createMockStore();
    await store.dispatch(fetchProducts());

    const state = store.getState().products;
    expect(state.loading).toBe(false);
    expect(state.products).toEqual(mockProducts);
    expect(state.error).toBe(null);
  });

  it('should handle fetchProducts.rejected', async () => {
    const errorMessage = 'Failed to fetch products';
    (api.getProducts as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const store = createMockStore();
    await store.dispatch(fetchProducts());

    const state = store.getState().products;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle fetchCategories.fulfilled', async () => {
    const mockCategories = ['electronics', 'clothing', 'jewelery'];
    (api.getCategories as jest.Mock).mockResolvedValue(mockCategories);

    const store = createMockStore();
    await store.dispatch(fetchCategories());

    const state = store.getState().products;
    expect(state.categories).toEqual(mockCategories);
  });

  it('should handle fetchCategories.rejected', async () => {
    const errorMessage = 'Failed to fetch categories';
    (api.getCategories as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const store = createMockStore();
    await store.dispatch(fetchCategories());

    // Categories should remain empty on error (no error state for categories)
    const state = store.getState().products;
    expect(state.categories).toEqual([]);
  });

  it('should handle multiple fetchProducts calls', async () => {
    const mockProducts = [
      {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        description: 'Test description',
        category: 'electronics',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 100 },
      },
    ];

    (api.getProducts as jest.Mock).mockResolvedValue(mockProducts);

    const store = createMockStore();
    await store.dispatch(fetchProducts());
    await store.dispatch(fetchProducts());

    const state = store.getState().products;
    expect(state.products).toEqual(mockProducts);
    expect(api.getProducts).toHaveBeenCalledTimes(2);
  });

  it('should clear error on new fetchProducts.pending', () => {
    const store = createMockStore();
    const errorMessage = 'Error';
    store.dispatch(fetchProducts.rejected({ message: errorMessage } as any, '', undefined, errorMessage));
    
    expect(store.getState().products.error).toBe(errorMessage);
    
    store.dispatch(fetchProducts.pending('', undefined));
    
    expect(store.getState().products.error).toBe(null);
  });

  it('should handle empty products array', async () => {
    (api.getProducts as jest.Mock).mockResolvedValue([]);

    const store = createMockStore();
    await store.dispatch(fetchProducts());

    const state = store.getState().products;
    expect(state.products).toEqual([]);
    expect(state.loading).toBe(false);
  });

  it('should handle empty categories array', async () => {
    (api.getCategories as jest.Mock).mockResolvedValue([]);

    const store = createMockStore();
    await store.dispatch(fetchCategories());

    const state = store.getState().products;
    expect(state.categories).toEqual([]);
  });
});
