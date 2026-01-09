import { Product } from '../types';
import { FilterState } from '../types';

export const filterAndSortProducts = (
  products: Product[],
  filters: FilterState
): Product[] => {
  let filtered = [...products];

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(query)
    );
  }

  if (filters.category) {
    filtered = filtered.filter(product =>
      product.category === filters.category
    );
  }

  if (filters.sortBy) {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }

  return filtered;
};
