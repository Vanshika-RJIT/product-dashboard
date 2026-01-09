jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
  },
  __esModule: true,
}));

jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    useParams: () => ({ id: '1' }),
    useNavigate: () => jest.fn(),
    MemoryRouter: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
    Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) =>
      React.createElement('a', { href: to, className }, children),
  };
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import ProductDetailPage from '../ProductDetailPage';
import productsReducer from '../../store/slices/productsSlice';
import filtersReducer from '../../store/slices/filtersSlice';
import favoritesReducer from '../../store/slices/favoritesSlice';
import { api } from '../../utils/api';

jest.mock('../../utils/api', () => ({
  api: {
    getProduct: jest.fn(),
  },
}));

const mockProduct = {
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

describe('ProductDetailPage', () => {
  beforeEach(() => {
    (api.getProduct as jest.Mock).mockResolvedValue(mockProduct);
  });

  it('displays product details after loading', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/product/1']}>
          <ProductDetailPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('displays favorite button', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/product/1']}>
          <ProductDetailPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument();
  });

  it('toggles favorite when favorite button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/product/1']}>
          <ProductDetailPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const favoriteButton = screen.getByText('🤍 Add to Favorites');
    await user.click(favoriteButton);

    expect(store.getState().favorites.favoriteIds).toContain(1);
  });

  it('displays error message on error', async () => {
    (api.getProduct as jest.Mock).mockRejectedValue(new Error('Not found'));
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/product/1']}>
          <ProductDetailPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });
  });
});
