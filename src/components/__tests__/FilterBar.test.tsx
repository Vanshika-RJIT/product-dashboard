jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
  },
  __esModule: true,
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FilterBar from '../FilterBar';
import productsReducer from '../../store/slices/productsSlice';
import filtersReducer from '../../store/slices/filtersSlice';
import favoritesReducer from '../../store/slices/favoritesSlice';

const createMockStore = (initialFilters = { searchQuery: '', category: '', sortBy: '' }) => {
  return configureStore({
    reducer: {
      products: productsReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      products: {
        products: [],
        loading: false,
        error: null,
        categories: ['electronics', 'clothing', 'jewelery'],
      },
      filters: initialFilters,
      favorites: { favoriteIds: [] },
    },
  });
};

describe('FilterBar', () => {
  it('renders category and sort selects', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    );

    expect(screen.getByLabelText('Filter by category')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort products')).toBeInTheDocument();
  });

  it('dispatches setCategory when category changes', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    );

    const categorySelect = screen.getByLabelText('Filter by category');
    await user.selectOptions(categorySelect, 'electronics');

    expect(store.getState().filters.category).toBe('electronics');
  });

  it('dispatches setSortBy when sort changes', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    );

    const sortSelect = screen.getByLabelText('Sort products');
    await user.selectOptions(sortSelect, 'price-asc');

    expect(store.getState().filters.sortBy).toBe('price-asc');
  });

  it('dispatches clearFilters when clear button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore({ searchQuery: '', category: 'electronics', sortBy: 'price-asc' });
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    );

    const clearButton = screen.getByLabelText('Clear all filters');
    await user.click(clearButton);

    const state = store.getState().filters;
    expect(state.category).toBe('');
    expect(state.sortBy).toBe('');
  });

  it('disables clear button when no filters are active', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    );

    const clearButton = screen.getByLabelText('Clear all filters');
    expect(clearButton).toBeDisabled();
  });

  it('enables clear button when filters are active', () => {
    const store = createMockStore({ searchQuery: '', category: 'electronics', sortBy: '' });
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    );

    const clearButton = screen.getByLabelText('Clear all filters');
    expect(clearButton).not.toBeDisabled();
  });

  it('enables clear button when search query is active', () => {
    const store = createMockStore({ searchQuery: 'laptop', category: '', sortBy: '' });
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    );

    const clearButton = screen.getByLabelText('Clear all filters');
    expect(clearButton).not.toBeDisabled();
  });

  it('enables clear button when sort is active', () => {
    const store = createMockStore({ searchQuery: '', category: '', sortBy: 'price-asc' });
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    );

    const clearButton = screen.getByLabelText('Clear all filters');
    expect(clearButton).not.toBeDisabled();
  });

  it('renders all category options', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    );

    const categorySelect = screen.getByLabelText('Filter by category');
    expect(categorySelect).toBeInTheDocument();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  it('renders all sort options', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    );

    const sortSelect = screen.getByLabelText('Sort products');
    expect(sortSelect).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('handles all sort options correctly', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    );

    const sortSelect = screen.getByLabelText('Sort products');
    
    await user.selectOptions(sortSelect, 'price-asc');
    expect(store.getState().filters.sortBy).toBe('price-asc');
    
    await user.selectOptions(sortSelect, 'price-desc');
    expect(store.getState().filters.sortBy).toBe('price-desc');
    
    await user.selectOptions(sortSelect, 'title-asc');
    expect(store.getState().filters.sortBy).toBe('title-asc');
    
    await user.selectOptions(sortSelect, 'title-desc');
    expect(store.getState().filters.sortBy).toBe('title-desc');
  });
});
