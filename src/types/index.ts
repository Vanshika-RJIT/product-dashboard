export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface FilterState {
  searchQuery: string;
  category: string;
  sortBy: 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc' | '';
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  categories: string[];
}

export interface FavoritesState {
  favoriteIds: number[];
}
