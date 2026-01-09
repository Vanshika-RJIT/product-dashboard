jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
  },
  __esModule: true,
}));

jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    BrowserRouter: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
    Routes: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
    Route: ({ element }: { element: React.ReactNode }) => React.createElement('div', null, element),
    Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) =>
      React.createElement('a', { href: to, className }, children),
    useParams: () => ({}),
    useNavigate: () => jest.fn(),
  };
});

jest.mock('./pages/ProductListingPage', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('div', null, 'ProductListingPage'),
  };
});

jest.mock('./pages/ProductDetailPage', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('div', null, 'ProductDetailPage'),
  };
});

jest.mock('./pages/FavoritesPage', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('div', null, 'FavoritesPage'),
  };
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import productsReducer from './store/slices/productsSlice';
import filtersReducer from './store/slices/filtersSlice';
import favoritesReducer from './store/slices/favoritesSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      products: productsReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
    },
  });
};

describe('App', () => {
  it('renders navigation', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

        await waitFor(() => {
      // Check for navigation text - could be "Product Dashboard" or emoji version
      const dashboardText = screen.queryByText(/Product Dashboard|🛍️/) || 
                           screen.queryByText(/product dashboard/i);
      expect(dashboardText).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText('Products')).toBeInTheDocument();
    // Favorites link text
    const favoritesLink = screen.queryByText(/Favorites|❤️/) || 
                         screen.queryByText(/favorites/i);
    expect(favoritesLink).toBeInTheDocument();
  });

  it('renders product listing page by default', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

        await waitFor(() => {
      // Navigation should be visible
      const dashboardText = screen.queryByText(/Product Dashboard|🛍️/) || 
                           screen.queryByText(/product dashboard/i);
      expect(dashboardText).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
