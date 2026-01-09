jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
  },
  __esModule: true,
}));

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchBar from '../SearchBar';
import productsReducer from '../../store/slices/productsSlice';
import filtersReducer from '../../store/slices/filtersSlice';
import favoritesReducer from '../../store/slices/favoritesSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      products: productsReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
    },
  });
};

describe('SearchBar', () => {
  it('renders search input', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search products by title...');
    expect(input).toBeInTheDocument();
  });

  it('updates local query on input change', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search products by title...');
    await user.type(input, 'laptop');

    expect(input).toHaveValue('laptop');
  });

  it('dispatches search query after debounce', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    const store = createMockStore();
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search products by title...');
    await user.type(input, 'test');

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(store.getState().filters.searchQuery).toBe('test');
    });

    jest.useRealTimers();
  });

  it('shows clear button when input has value', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search products by title...');
    await user.type(input, 'test');

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search products by title...');
    await user.type(input, 'test');

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    expect(input).toHaveValue('');
  });

  it('clears Redux state when clear button is clicked', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    const store = createMockStore();
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search products by title...');
    await user.type(input, 'test');
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(store.getState().filters.searchQuery).toBe('test');
    });

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    await waitFor(() => {
      expect(store.getState().filters.searchQuery).toBe('');
    });

    jest.useRealTimers();
  });

  it('debounces multiple rapid input changes', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    const store = createMockStore();
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search products by title...');
    await user.type(input, 'l');
    jest.advanceTimersByTime(100);
    await user.type(input, 'a');
    jest.advanceTimersByTime(100);
    await user.type(input, 'p');
    jest.advanceTimersByTime(100);
    await user.type(input, 't');
    jest.advanceTimersByTime(100);
    await user.type(input, 'o');
    jest.advanceTimersByTime(100);
    await user.type(input, 'p');
    
    // Should not have dispatched yet
    expect(store.getState().filters.searchQuery).toBe('');
    
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(store.getState().filters.searchQuery).toBe('laptop');
    });

    jest.useRealTimers();
  });

  it('handles empty search query', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    const store = createMockStore();
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search products by title...');
    await user.type(input, 'test');
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(store.getState().filters.searchQuery).toBe('test');
    });

    await user.clear(input);
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(store.getState().filters.searchQuery).toBe('');
    });

    jest.useRealTimers();
  });
});
