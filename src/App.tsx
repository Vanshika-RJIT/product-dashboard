import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for code splitting
const ProductListingPage = lazy(() => import('./pages/ProductListingPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  <Link to="/" className="hover:opacity-80 transition-opacity" aria-label="Product Dashboard Home">
                    🛍️ Product Dashboard
                  </Link>
                </h1>
                <nav aria-label="Main navigation">
                  <div className="flex gap-2">
                    <Link
                      to="/"
                      className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                      aria-label="View all products"
                    >
                      Products
                    </Link>
                    <Link
                      to="/favorites"
                      className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                      aria-label="View favorite products"
                    >
                      ❤️ Favorites
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          </nav>
          <main className="min-h-[calc(100vh-80px)]">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<ProductListingPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
