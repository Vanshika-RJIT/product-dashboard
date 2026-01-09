jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
  },
  __esModule: true,
}));

jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) =>
      React.createElement('a', { href: to, className }, children),
    MemoryRouter: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  };
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import FavoritesPage from '../FavoritesPage';
import productsReducer, { fetchProducts } from '../../store/slices/productsSlice';
import filtersReducer from '../../store/slices/filtersSlice';
import favoritesReducer from '../../store/slices/favoritesSlice';

jest.mock('../../utils/api', () => ({
  api: {
    getProducts: jest.fn(() =>
      Promise.resolve([
        {
          id: 1,
          title: 'Favorite Product',
          price: 99.99,
          description: 'Test description',
          category: 'electronics',
          image: 'test.jpg',
          rating: { rate: 4.5, count: 100 },
        },
      ])
    ),
  },
}));

const createMockStore = (favoriteIds: number[] = [], preloadedProducts: any[] = []) => {
  return configureStore({
    reducer: {
      products: productsReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      products: {
        products: preloadedProducts,
        loading: false,
        error: null,
        categories: preloadedProducts.length > 0 ? ['electronics'] : [],
      },
      filters: {
        searchQuery: '',
        category: '',
        sortBy: '',
      },
      favorites: { favoriteIds },
    },
  });
};

describe('FavoritesPage', () => {
  it('renders page title', async () => {
    const store = createMockStore([], []);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

        // But since we have empty array, it should still show title
    await waitFor(() => {
      expect(screen.getByText('My Favorites')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays empty state when no favorites', async () => {
    // Preload some products but no favorites
    const mockProduct = {
      id: 2,
      title: 'Other Product',
      price: 49.99,
      description: 'Test description',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 4.0, count: 50 },
    };
    
    const store = createMockStore([], [mockProduct]);
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

        await waitFor(() => {
      expect(screen.getByText('No favorite products yet')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays favorite products', async () => {
    const mockProduct = {
      id: 1,
      title: 'Favorite Product',
      price: 99.99,
      description: 'Test description',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 4.5, count: 100 },
    };
    
    const store = createMockStore([1], [mockProduct]);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

        // Wait for favorite product to render
    await waitFor(() => {
      expect(screen.getByText('Favorite Product')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays favorite count', async () => {
    const mockProduct = {
      id: 1,
      title: 'Favorite Product',
      price: 99.99,
      description: 'Test description',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 4.5, count: 100 },
    };
    
    const store = createMockStore([1], [mockProduct]);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

        // Wait for favorite count to render
    await waitFor(() => {
      // The text is "You have 1 favorite product"
      expect(screen.getByText(/You have/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays loading spinner while loading', () => {
    const store = configureStore({
      reducer: {
        products: productsReducer,
        filters: filtersReducer,
        favorites: favoritesReducer,
      },
      preloadedState: {
        products: {
          products: [],
          loading: true,
          error: null,
          categories: [],
        },
        filters: {
          searchQuery: '',
          category: '',
          sortBy: '',
        },
        favorites: { favoriteIds: [] },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });
});
