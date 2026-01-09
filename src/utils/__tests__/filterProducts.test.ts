import { filterAndSortProducts } from '../filterProducts';
import { Product, FilterState } from '../../types';

const mockProducts: Product[] = [
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
  {
    id: 3,
    title: 'Phone',
    price: 699.99,
    description: 'A smartphone',
    category: 'electronics',
    image: 'phone.jpg',
    rating: { rate: 4.8, count: 200 },
  },
];

describe('filterAndSortProducts', () => {
  it('should return all products when no filters applied', () => {
    const filters: FilterState = {
      searchQuery: '',
      category: '',
      sortBy: '',
    };
    const result = filterAndSortProducts(mockProducts, filters);
    expect(result).toHaveLength(3);
  });

  it('should filter by search query', () => {
    const filters: FilterState = {
      searchQuery: 'laptop',
      category: '',
      sortBy: '',
    };
    const result = filterAndSortProducts(mockProducts, filters);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Laptop');
  });

  it('should filter by category', () => {
    const filters: FilterState = {
      searchQuery: '',
      category: 'electronics',
      sortBy: '',
    };
    const result = filterAndSortProducts(mockProducts, filters);
    expect(result).toHaveLength(2);
    expect(result.every(p => p.category === 'electronics')).toBe(true);
  });

  it('should sort by price ascending', () => {
    const filters: FilterState = {
      searchQuery: '',
      category: '',
      sortBy: 'price-asc',
    };
    const result = filterAndSortProducts(mockProducts, filters);
    expect(result[0].price).toBe(19.99);
    expect(result[result.length - 1].price).toBe(999.99);
  });

  it('should sort by price descending', () => {
    const filters: FilterState = {
      searchQuery: '',
      category: '',
      sortBy: 'price-desc',
    };
    const result = filterAndSortProducts(mockProducts, filters);
    expect(result[0].price).toBe(999.99);
    expect(result[result.length - 1].price).toBe(19.99);
  });

  it('should combine search and category filters', () => {
    const filters: FilterState = {
      searchQuery: 'phone',
      category: 'electronics',
      sortBy: '',
    };
    const result = filterAndSortProducts(mockProducts, filters);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Phone');
  });
});
