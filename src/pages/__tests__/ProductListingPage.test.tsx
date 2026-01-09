jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
  },
  __esModule: true,
}));

jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    MemoryRouter: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
    Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) =>
      React.createElement('a', { href: to, className }, children),
  };
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import ProductListingPage from '../ProductListingPage';
import productsReducer, { fetchProducts, fetchCategories } from '../../store/slices/productsSlice';
import filtersReducer, { setSearchQuery } from '../../store/slices/filtersSlice';
import favoritesReducer from '../../store/slices/favoritesSlice';

jest.mock('../../utils/api', () => ({
  api: {
    getProducts: jest.fn(() =>
      Promise.resolve([
        {
          id: 1,
          title: 'Test Product',
          price: 99.99,
          description: 'Test description',
          category: 'electronics',
          image: 'test.jpg',
          rating: { rate: 4.5, count: 100 },
        },
      ])
    ),
    getCategories: jest.fn(() => Promise.resolve(['electronics'])),
  },
}));

const createMockStore = (preloadedProducts: any[] = [], preloadedCategories: string[] = [], error: string | null = null) => {
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
        error: error,
        categories: preloadedCategories,
      },
      filters: {
        searchQuery: '',
        category: '',
        sortBy: '',
      },
      favorites: { favoriteIds: [] },
    },
  });
};

describe('ProductListingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { api } = require('../../utils/api');
    (api.getProducts as jest.Mock).mockResolvedValue([
      {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        description: 'Test description',
        category: 'electronics',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 100 },
      },
    ]);
    (api.getCategories as jest.Mock).mockResolvedValue(['electronics']);
  });
  it('renders page title', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductListingPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Discover Products')).toBeInTheDocument();
    });
  });

  it('displays loading spinner while loading', () => {
    const store = createMockStore();
    store.dispatch(fetchProducts.pending('', undefined));
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductListingPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('displays error message on error', async () => {
    const store = createMockStore();
    const errorMessage = 'Test error';
    
    const { api } = require('../../utils/api');
    (api.getProducts as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductListingPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const state = store.getState();
      expect(state.products.error).toBe(errorMessage);
      expect(state.products.loading).toBe(false);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Test error')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays products after loading', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductListingPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const state = store.getState();
      expect(state.products.loading).toBe(false);
      expect(state.products.products).toBeDefined();
      expect(Array.isArray(state.products.products)).toBe(true);
      expect(state.products.products.length).toBeGreaterThan(0);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays product count', async () => {
    const mockProduct = {
      id: 1,
      title: 'Test Product',
      price: 99.99,
      description: 'Test description',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 4.5, count: 100 },
    };
    
    const store = createMockStore([mockProduct], ['electronics']);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductListingPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Showing/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays no products message when filtered results are empty', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductListingPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const state = store.getState();
      expect(state.products.loading).toBe(false);
      expect(state.products.products).toBeDefined();
      expect(Array.isArray(state.products.products)).toBe(true);
      expect(state.products.products.length).toBeGreaterThan(0);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    }, { timeout: 3000 });

    store.dispatch(setSearchQuery('nonexistent'));

    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
