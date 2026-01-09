import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Product } from '../types';
import { filterAndSortProducts } from '../utils/filterProducts';

// Base selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectCategories = (state: RootState) => state.products.categories;
export const selectFilters = (state: RootState) => state.filters;
export const selectFavoriteIds = (state: RootState) => state.favorites.favoriteIds;

// Memoized selectors
export const selectFilteredProducts = createSelector(
  [selectProducts, selectFilters],
  (products, filters) => {
    if (!products || !Array.isArray(products)) return [];
    return filterAndSortProducts(products, filters);
  }
);

export const selectFavoriteProducts = createSelector(
  [selectProducts, selectFavoriteIds],
  (products, favoriteIds): Product[] => {
    if (!products || !Array.isArray(products)) return [];
    if (!favoriteIds || !Array.isArray(favoriteIds)) return [];
    return products.filter((product: Product) => favoriteIds.includes(product.id));
  }
);

export const selectProductById = (id: number) =>
  createSelector(
    [selectProducts],
    (products): Product | undefined => products.find((product: Product) => product.id === id)
  );

export const selectIsFavorite = (productId: number) =>
  createSelector(
    [selectFavoriteIds],
    (favoriteIds) => {
      if (!favoriteIds || !Array.isArray(favoriteIds)) return false;
      return favoriteIds.includes(productId);
    }
  );

export const selectProductsCount = createSelector(
  [selectProducts],
  (products) => (products && Array.isArray(products)) ? products.length : 0
);

export const selectFilteredProductsCount = createSelector(
  [selectFilteredProducts],
  (filteredProducts) => (filteredProducts && Array.isArray(filteredProducts)) ? filteredProducts.length : 0
);
