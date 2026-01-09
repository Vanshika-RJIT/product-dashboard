import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchProducts, fetchCategories } from '../store/slices/productsSlice';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { filterAndSortProducts } from '../utils/filterProducts';

const ProductListingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products = [], loading, error } = useAppSelector(
    state => state.products
  );
  const filters = useAppSelector(state => state.filters);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const filteredProducts = filterAndSortProducts(products, filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Discover Products</h1>
      <p className="text-gray-600 mb-6">
        Browse our amazing collection of products
      </p>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <SearchBar />
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <FilterBar />
      </div>

      <p className="mb-6">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {filteredProducts.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
