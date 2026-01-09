import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { api } from '../utils/api';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productId = useMemo(() => (id ? parseInt(id) : null), [id]);
  const favoriteIds = useAppSelector(state => state.favorites.favoriteIds);
  const isFavorite = productId ? favoriteIds.includes(productId) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await api.getProduct(productId);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <ErrorMessage
        message={error || 'Product not found'}
        onRetry={() => navigate('/')}
      />
    );
  }

  const handleFavoriteClick = () => {
    dispatch(toggleFavorite(product.id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Products
      </Link>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="max-w-full h-96 object-contain transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800 pr-4">{product.title}</h1>
              <button
                onClick={handleFavoriteClick}
                className={`ml-4 p-3 rounded-full transition-all duration-200 flex-shrink-0 ${
                  isFavorite
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg scale-110'
                    : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg
                  className={`w-8 h-8 ${isFavorite ? 'fill-current' : ''}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
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
              </button>
            </div>

            <div className="mb-4">
              <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                {product.category}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="mb-6 flex items-center bg-yellow-50 px-4 py-3 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-500 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="ml-2 text-lg font-bold text-gray-700">
                {product.rating.rate}
              </span>
              <span className="ml-2 text-gray-600">
                ({product.rating.count} reviews)
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleFavoriteClick}
                className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all duration-200 ${
                  isFavorite
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </button>
              <Link
                to="/favorites"
                className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all duration-200 text-center shadow-lg hover:shadow-xl"
              >
                View Favorites
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
