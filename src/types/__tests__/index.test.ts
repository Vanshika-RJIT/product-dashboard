import type { Product, FilterState, ProductsState, FavoritesState } from '../index';

describe('Type definitions', () => {
  it('Product type has correct structure', () => {
    const product: Product = {
      id: 1,
      title: 'Test',
      price: 99.99,
      description: 'Test',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 4.5, count: 100 },
    };

    expect(product.id).toBe(1);
    expect(product.rating.rate).toBe(4.5);
  });

  it('FilterState type has correct structure', () => {
    const filter: FilterState = {
      searchQuery: '',
      category: '',
      sortBy: '',
    };

    expect(filter.searchQuery).toBe('');
  });

  it('ProductsState type has correct structure', () => {
    const state: ProductsState = {
      products: [],
      loading: false,
      error: null,
      categories: [],
    };

    expect(state.products).toEqual([]);
  });

  it('FavoritesState type has correct structure', () => {
    const state: FavoritesState = {
      favoriteIds: [],
    };

    expect(state.favoriteIds).toEqual([]);
  });
});
