import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchProducts } from '../store/slices/productsSlice';
import {
  selectFavoriteProducts,
  selectProductsLoading,
  selectProductsCount,
} from '../store/selectors';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const FavoritesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectProductsLoading);
  const productsCount = useAppSelector(selectProductsCount);
  const favoriteProducts = useAppSelector(selectFavoriteProducts);

  useEffect(() => {
    if (productsCount === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsCount]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Favorites</h1>
          <p className="text-gray-600">Your saved products</p>
        </div>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
        >
          ← Back to Products
        </Link>
      </div>

      {!favoriteProducts || favoriteProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <svg
            className="mx-auto h-24 w-24 text-red-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p className="text-gray-500 text-xl font-semibold mb-2">No favorite products yet</p>
          <p className="text-gray-400 mb-6">Start adding products to your favorites!</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            Browse Products →
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-700 font-medium">
              You have <span className="font-bold text-red-600">{favoriteProducts.length}</span> favorite product{favoriteProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
