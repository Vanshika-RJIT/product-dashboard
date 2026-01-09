// Mock axios before any imports
jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
  },
  __esModule: true,
}));

import React from 'react';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../redux';
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

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createMockStore();
  return React.createElement(Provider, { store }, children);
};

describe('redux hooks', () => {
  it('useAppDispatch returns dispatch function', () => {
    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    expect(typeof result.current).toBe('function');
  });

  it('useAppSelector can select state', () => {
    const { result } = renderHook(
      () => useAppSelector((state) => state.filters),
      { wrapper }
    );
    expect(result.current).toEqual({
      searchQuery: '',
      category: '',
      sortBy: '',
    });
  });
});
