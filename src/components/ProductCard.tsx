import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(state => state.favorites.favoriteIds);
  const isFavorite = favoriteIds.includes(product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(product.id));
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
      aria-label={`View details for ${product.title}`}
    >
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl"></div>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-contain p-4 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition-all duration-200 ${
            isFavorite
              ? 'bg-red-500 text-white hover:bg-red-600 scale-110'
              : 'bg-white text-gray-400 hover:bg-red-50 hover:text-red-500'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`}
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
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
            <svg
              className="w-5 h-5 text-yellow-500 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="ml-1 text-sm font-semibold text-gray-700">
              {product.rating.rate}
            </span>
            <span className="ml-1 text-xs text-gray-500">
              ({product.rating.count})
            </span>
          </div>
        </div>
        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
          {product.category}
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
