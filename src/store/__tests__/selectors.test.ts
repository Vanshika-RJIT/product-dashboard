jest.mock('../../utils/api', () => ({
  api: {
    getProducts: jest.fn(),
    getProduct: jest.fn(),
    getCategories: jest.fn(),
  },
}));

import { configureStore } from '@reduxjs/toolkit';
import {
  selectProducts,
  selectFilteredProducts,
  selectFavoriteProducts,
  selectIsFavorite,
  selectProductsCount,
  selectFilteredProductsCount,
} from '../selectors';
import { setSearchQuery, setCategory } from '../slices/filtersSlice';
import productsReducer from '../slices/productsSlice';
import filtersReducer from '../slices/filtersSlice';
import favoritesReducer from '../slices/favoritesSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      products: productsReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      products: {
        products: [
          {
            id: 1,
            title: 'Laptop',
            price: 999.99,
            description: 'A great laptop',
            category: 'electronics',
            image: 'laptop.jpg',
            rating: { rate: 4.5, count: 100 },
          },
          {
            id: 2,
            title: 'T-Shirt',
            price: 19.99,
            description: 'A comfortable t-shirt',
            category: 'clothing',
            image: 'tshirt.jpg',
            rating: { rate: 4.0, count: 50 },
          },
        ],
        loading: false,
        error: null,
        categories: ['electronics', 'clothing'],
      },
      filters: {
        searchQuery: '',
        category: '',
        sortBy: '',
      },
      favorites: {
        favoriteIds: [1],
      },
    },
  });
};

describe('selectors', () => {
  it('selectProducts returns all products', () => {
    const store = createMockStore();
    const products = selectProducts(store.getState());
    expect(products).toHaveLength(2);
  });

  it('selectFilteredProducts filters by search query', () => {
    const store = createMockStore();
    store.dispatch(setSearchQuery('Laptop'));
    const filtered = selectFilteredProducts(store.getState());
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Laptop');
  });

  it('selectFilteredProducts filters by category', () => {
    const store = createMockStore();
    store.dispatch(setCategory('electronics'));
    const filtered = selectFilteredProducts(store.getState());
    expect(filtered).toHaveLength(1);
    expect(filtered[0].category).toBe('electronics');
  });

  it('selectFavoriteProducts returns only favorited products', () => {
    const store = createMockStore();
    const favorites = selectFavoriteProducts(store.getState());
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe(1);
  });

  it('selectIsFavorite returns true for favorited product', () => {
    const store = createMockStore();
    const isFavorite = selectIsFavorite(1)(store.getState());
    expect(isFavorite).toBe(true);
  });

  it('selectIsFavorite returns false for non-favorited product', () => {
    const store = createMockStore();
    const isFavorite = selectIsFavorite(2)(store.getState());
    expect(isFavorite).toBe(false);
  });

  it('selectProductsCount returns correct count', () => {
    const store = createMockStore();
    const count = selectProductsCount(store.getState());
    expect(count).toBe(2);
  });

  it('selectFilteredProductsCount returns correct filtered count', () => {
    const store = createMockStore();
    store.dispatch(setCategory('electronics'));
    const count = selectFilteredProductsCount(store.getState());
    expect(count).toBe(1);
  });
});
