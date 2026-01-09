import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { setSearchQuery } from '../store/slices/filtersSlice';
import { debounce } from '../utils/debounce';

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [localQuery, setLocalQuery] = useState('');

  // Memoize debounced dispatch function to prevent recreation on every render
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      dispatch(setSearchQuery(query));
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(localQuery);
  }, [localQuery, debouncedSearch]);

  return (
    <div className="w-full max-w-2xl">
      <label htmlFor="search" className="sr-only">
        Search products
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          id="search"
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search products by title..."
          className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700"
          aria-label="Search products"
        />
        {localQuery && (
          <button
            onClick={() => {
              setLocalQuery('');
              dispatch(setSearchQuery(''));
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
