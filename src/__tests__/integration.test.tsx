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
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import ProductListingPage from '../pages/ProductListingPage';
import productsReducer, { fetchProducts, fetchCategories } from '../store/slices/productsSlice';
import filtersReducer, { setSearchQuery } from '../store/slices/filtersSlice';
import favoritesReducer from '../store/slices/favoritesSlice';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { filterAndSortProducts } from '../utils/filterProducts';
jest.mock('../utils/api', () => ({
  api: {
    getProducts: jest.fn(() =>
      Promise.resolve([
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
      ])
    ),
    getCategories: jest.fn(() =>
      Promise.resolve(['electronics', 'clothing'])
    ),
  },
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      products: productsReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
    },
  });
};

describe('Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { api } = require('../utils/api');
    (api.getProducts as jest.Mock).mockResolvedValue([
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
    ]);
    (api.getCategories as jest.Mock).mockResolvedValue(['electronics', 'clothing']);
  });

  it('should search products by title', async () => {
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
      expect(state.products.products).toBeDefined();
      expect(Array.isArray(state.products.products)).toBe(true);
      expect(state.products.products.length).toBeGreaterThan(0);
      expect(state.products.loading).toBe(false);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    }, { timeout: 3000 });

    act(() => {
      store.dispatch(setSearchQuery('Laptop'));
    });

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.searchQuery).toBe('Laptop');
      const filtered = filterAndSortProducts(state.products.products, state.filters);
      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toBe('Laptop');
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should filter products by category', async () => {
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
      expect(state.products.products).toBeDefined();
      expect(Array.isArray(state.products.products)).toBe(true);
      expect(state.products.products.length).toBeGreaterThan(0);
      expect(state.products.loading).toBe(false);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    }, { timeout: 3000 });

    const categorySelect = screen.getByLabelText('Filter by category');
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should sort products by price', async () => {
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
      expect(state.products.products).toBeDefined();
      expect(Array.isArray(state.products.products)).toBe(true);
      expect(state.products.products.length).toBeGreaterThan(0);
      expect(state.products.loading).toBe(false);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    }, { timeout: 3000 });

    const sortSelect = screen.getByLabelText('Sort products');
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

    await waitFor(() => {
      const tShirt = screen.queryByText('T-Shirt');
      const laptop = screen.queryByText('Laptop');
      
      expect(tShirt).toBeInTheDocument();
      expect(laptop).toBeInTheDocument();
      
      const productCards = screen.getAllByText(/Laptop|T-Shirt/);
      expect(productCards.length).toBe(2);
      
      expect(screen.getByText('$19.99')).toBeInTheDocument();
      expect(screen.getByText('$999.99')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should add and remove products from favorites', async () => {
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
      expect(state.products.products).toBeDefined();
      expect(Array.isArray(state.products.products)).toBe(true);
      expect(state.products.products.length).toBeGreaterThan(0);
      expect(state.products.loading).toBe(false);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    }, { timeout: 3000 });

    const favoriteButtons = screen.getAllByLabelText(/Add to favorites|Remove from favorites/);
    const firstFavoriteButton = favoriteButtons[0];
    
    await userEvent.click(firstFavoriteButton);

    await waitFor(() => {
      expect(store.getState().favorites.favoriteIds).toContain(1);
    }, { timeout: 2000 });

    await userEvent.click(firstFavoriteButton);

    await waitFor(() => {
      expect(store.getState().favorites.favoriteIds).not.toContain(1);
    }, { timeout: 2000 });
  });

  it('should filter products by category and then search', async () => {
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
      expect(state.products.products).toBeDefined();
      expect(Array.isArray(state.products.products)).toBe(true);
      expect(state.products.products.length).toBeGreaterThan(0);
      expect(state.products.loading).toBe(false);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    }, { timeout: 3000 });

    const categorySelect = screen.getByLabelText('Filter by category');
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    act(() => {
      store.dispatch(setSearchQuery('Laptop'));
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should search, filter, and sort products together', async () => {
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
      expect(state.products.products).toBeDefined();
      expect(Array.isArray(state.products.products)).toBe(true);
      expect(state.products.products.length).toBeGreaterThan(0);
      expect(state.products.loading).toBe(false);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    }, { timeout: 3000 });

    act(() => {
      store.dispatch(setSearchQuery('Laptop'));
    });

    const categorySelect = screen.getByLabelText('Filter by category');
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });

    const sortSelect = screen.getByLabelText('Sort products');
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should add multiple products to favorites', async () => {
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
      expect(state.products.products).toBeDefined();
      expect(Array.isArray(state.products.products)).toBe(true);
      expect(state.products.products.length).toBeGreaterThan(0);
      expect(state.products.loading).toBe(false);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    }, { timeout: 3000 });

    const favoriteButtons = screen.getAllByLabelText(/Add to favorites|Remove from favorites/);
    await userEvent.click(favoriteButtons[0]);

    await waitFor(() => {
      expect(store.getState().favorites.favoriteIds).toContain(1);
    }, { timeout: 2000 });

    await userEvent.click(favoriteButtons[1]);

    await waitFor(() => {
      expect(store.getState().favorites.favoriteIds).toContain(1);
      expect(store.getState().favorites.favoriteIds).toContain(2);
      expect(store.getState().favorites.favoriteIds.length).toBe(2);
    }, { timeout: 2000 });
  });

  it('should clear filters and reset search', async () => {
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
      expect(state.products.products).toBeDefined();
      expect(Array.isArray(state.products.products)).toBe(true);
      expect(state.products.products.length).toBeGreaterThan(0);
      expect(state.products.loading).toBe(false);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    }, { timeout: 3000 });

    act(() => {
      store.dispatch(setSearchQuery('Laptop'));
    });
    
    const categorySelect = screen.getByLabelText('Filter by category');
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });

    await waitFor(() => {
      expect(store.getState().filters.searchQuery).toBe('Laptop');
      expect(store.getState().filters.category).toBe('electronics');
    }, { timeout: 2000 });

    const clearButton = screen.getByLabelText('Clear all filters');
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(store.getState().filters.searchQuery).toBe('');
      expect(store.getState().filters.category).toBe('');
      expect(store.getState().filters.sortBy).toBe('');
    }, { timeout: 2000 });
  });

  it('should show no results when search and filter combination matches nothing', async () => {
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
      expect(state.products.products).toBeDefined();
      expect(Array.isArray(state.products.products)).toBe(true);
      expect(state.products.products.length).toBeGreaterThan(0);
      expect(state.products.loading).toBe(false);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    }, { timeout: 3000 });

    act(() => {
      store.dispatch(setSearchQuery('NonExistentProduct'));
    });

    await waitFor(() => {
      expect(store.getState().filters.searchQuery).toBe('NonExistentProduct');
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument();
      expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
