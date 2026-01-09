import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setCategory, setSortBy, clearFilters } from '../store/slices/filtersSlice';

const FilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { category, sortBy, searchQuery } = useAppSelector(state => state.filters);
  const categories = useAppSelector(state => state.products.categories);

  const hasActiveFilters = category || sortBy || searchQuery;

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => dispatch(setCategory(e.target.value))}
          className="block w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white text-gray-700 font-medium"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories && Array.isArray(categories) && categories.map((cat: string) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label htmlFor="sort" className="block text-sm font-semibold text-gray-700 mb-2">
          Sort By
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value as any))}
          className="block w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white text-gray-700 font-medium"
          aria-label="Sort products"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          onClick={() => dispatch(clearFilters())}
          disabled={!hasActiveFilters}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
            hasActiveFilters
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
