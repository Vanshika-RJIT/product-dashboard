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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { Product } from '../../types';
import productsReducer from '../../store/slices/productsSlice';
import filtersReducer from '../../store/slices/filtersSlice';
import favoritesReducer from '../../store/slices/favoritesSlice';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'Test description',
  category: 'electronics',
  image: 'test.jpg',
  rating: { rate: 4.5, count: 100 },
};

const createMockStore = (favoriteIds: number[] = []) => {
  return configureStore({
    reducer: {
      products: productsReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      favorites: { favoriteIds },
    },
  });
};

describe('ProductCard', () => {
  it('renders product information', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductCard product={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('electronics')).toBeInTheDocument();
  });

  it('shows favorite icon when product is favorited', () => {
    const store = createMockStore([1]);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductCard product={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    const favoriteButton = screen.getByLabelText('Remove from favorites');
    expect(favoriteButton).toBeInTheDocument();
  });

  it('shows non-favorite icon when product is not favorited', () => {
    const store = createMockStore([]);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductCard product={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    const favoriteButton = screen.getByLabelText('Add to favorites');
    expect(favoriteButton).toBeInTheDocument();
  });

  it('toggles favorite when favorite button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore([]);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductCard product={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    const favoriteButton = screen.getByLabelText('Add to favorites');
    await user.click(favoriteButton);

    expect(store.getState().favorites.favoriteIds).toContain(1);
  });

  it('removes favorite when favorite button is clicked on favorited product', async () => {
    const user = userEvent.setup();
    const store = createMockStore([1]);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductCard product={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    const favoriteButton = screen.getByLabelText('Remove from favorites');
    await user.click(favoriteButton);

    expect(store.getState().favorites.favoriteIds).not.toContain(1);
  });

  it('renders product rating correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductCard product={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(100)')).toBeInTheDocument();
  });

  it('renders product description', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductCard product={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('has correct link to product detail page', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductCard product={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/1');
  });
});
