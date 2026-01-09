# Product Dashboard

A modern React application built with Redux Toolkit for managing and browsing products from the Fake Store API. This project demonstrates proficiency in building modern frontend applications with React, Redux Toolkit, and comprehensive testing.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Assignment Requirements](#-assignment-requirements)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [API Information](#-api-information)
- [Development Notes](#-development-notes)

## 🚀 Features

- **Product Listing Page**: Responsive grid display of products with cards
- **Search & Filter**: 
  - Debounced search by product title (300ms delay)
  - Filter by category
  - Sort by price (ascending/descending) and title (A-Z/Z-A)
- **Product Detail Page**: Complete product information with favorite toggle
- **Favorites Page**: View and manage favorited products stored in Redux
- **State Management**: Redux Toolkit with async thunks and memoized selectors
- **Testing**: Comprehensive unit and integration tests (126 tests)
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Accessibility**: ARIA labels and semantic HTML

## 🛠️ Tech Stack

- **React 19** - UI library with functional components and hooks
- **TypeScript** - Type safety throughout the application
- **Redux Toolkit** - State management with thunks and selectors
- **React Router v7** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Jest & React Testing Library** - Unit and integration testing
- **Fake Store API** - Product data source

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn

## 🚀 Getting Started

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/product-dashboard.git
   cd product-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   The application will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📁 Project Structure

```
product-dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ProductCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterBar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── ErrorBoundary.tsx
│   ├── pages/              # Page components
│   │   ├── ProductListingPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── FavoritesPage.tsx
│   ├── store/              # Redux store configuration
│   │   ├── index.ts        # Store setup
│   │   ├── selectors.ts    # Memoized selectors
│   │   └── slices/         # Redux slices
│   │       ├── productsSlice.ts
│   │       ├── filtersSlice.ts
│   │       └── favoritesSlice.ts
│   ├── hooks/              # Custom React hooks
│   │   └── redux.ts        # Typed Redux hooks
│   ├── utils/              # Utility functions
│   │   ├── api.ts          # API client (Axios)
│   │   ├── debounce.ts     # Debounce utility
│   │   └── filterProducts.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   └── __tests__/          # Integration tests
├── public/
└── package.json
```

## ✅ Assignment Requirements

### 1. React with Functional Components and Hooks ✅

- All components use functional components
- React hooks used throughout:
  - `useState` for local component state
  - `useEffect` for side effects (API calls, subscriptions)
  - `useMemo` for memoization
  - Custom hooks (`useAppSelector`, `useAppDispatch`) for Redux

### 2. Redux Toolkit State Management ✅

- **Three Redux Slices**:
  - `productsSlice`: Manages products, loading states, errors, and categories
  - `filtersSlice`: Handles search query, category filter, and sort options
  - `favoritesSlice`: Manages favorite product IDs

- **Async Thunks**: 
  - `fetchProducts`: Fetches all products from API
  - `fetchCategories`: Fetches product categories

- **Memoized Selectors**: 
  - `selectFilteredProducts`: Filters and sorts products
  - `selectFavoriteProducts`: Gets favorited products
  - `selectProductById`: Gets product by ID
  - `selectIsFavorite`: Checks if product is favorited

### 3. Fake Store API Integration ✅

- Base URL: `https://fakestoreapi.com`
- Endpoints used:
  - `GET /products` - Fetch all products
  - `GET /products/:id` - Fetch single product
  - `GET /products/categories` - Fetch categories
- Centralized API client in `src/utils/api.ts`

### 4. Pages Implementation ✅

#### Product Listing Page
- Displays products in responsive grid (1-4 columns based on screen size)
- Product cards with image, title, price, rating, and category
- Search bar with debounced input (300ms)
- Category filter dropdown
- Sort options (price asc/desc, title A-Z/Z-A)
- Product count display
- Empty state when no products match filters

#### Product Detail Page
- Complete product information display
- Large product image
- Title, description, price, rating, category
- Add/remove from favorites toggle
- Navigation back to listing page
- Link to favorites page

#### Favorites Page
- Displays all favorited products
- Same product card layout as listing page
- Empty state when no favorites
- Favorite count display
- Remove from favorites functionality

### 5. Redux Integration with Thunks/Selectors ✅

- **Async Thunks**: Handle API calls with proper loading/error states
- **Selectors**: Memoized selectors for efficient state access
- **Typed Hooks**: Custom typed hooks for Redux (`useAppSelector`, `useAppDispatch`)

### 6. Testing ✅

#### Unit Tests
- **Redux Slices**: All reducer actions tested
  - `productsSlice.test.ts`: 15+ tests
  - `filtersSlice.test.ts`: 10+ tests
  - `favoritesSlice.test.ts`: 8+ tests
- **Components**: Component rendering and interactions
  - `ProductCard.test.tsx`
  - `SearchBar.test.tsx`
  - `FilterBar.test.tsx`
  - `ErrorMessage.test.tsx`
  - `LoadingSpinner.test.tsx`
  - `ErrorBoundary.test.tsx`
- **Pages**: Page-level component tests
  - `ProductListingPage.test.tsx`
  - `ProductDetailPage.test.tsx`
  - `FavoritesPage.test.tsx`
- **Utilities**: Utility function tests
  - `api.test.ts`
  - `debounce.test.ts`
  - `filterProducts.test.ts`
- **Selectors**: Redux selector tests
  - `selectors.test.ts`

#### Integration Tests
- **Search Flow**: End-to-end search functionality
- **Filter Flow**: Category filtering
- **Sort Flow**: Price and title sorting
- **Favorites Flow**: Add/remove favorites
- **Combined Operations**: Search + filter + sort together

**Total Test Count**: 126 tests, all passing ✅

**Test Coverage Report**:
- Run `npm run test:coverage` to generate detailed coverage reports
- Coverage report available in `coverage/lcov-report/index.html`
- All test suites and tests are passing successfully

### 7. Responsive and Accessible UI ✅

- **Tailwind CSS**: Utility-first styling
- **Responsive Design**:
  - Mobile: Single column
  - Tablet: 2-3 columns
  - Desktop: 4 columns
- **Accessibility**:
  - Semantic HTML elements
  - ARIA labels on interactive elements
  - Keyboard navigation support
  - Screen reader friendly
  - Proper focus management

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage --watchAll=false

# Run tests in CI mode
npm run test:ci

# Run specific test file
npm test -- ProductCard.test.tsx
```

### Test Coverage

Generate a detailed coverage report:

```bash
npm run test:coverage
```

View the HTML coverage report:
- Open `coverage/lcov-report/index.html` in your browser
- See line-by-line coverage for all files

### Test Results

**Current Test Status**:
- ✅ **126 tests passing**
- ✅ **22 test suites passing**
- ✅ **0 tests failing**
- ✅ Comprehensive test coverage across all components and features

**Test Coverage Metrics**:
- **Statements**: 89.69%
- **Branches**: 85.34%
- **Functions**: 90.69%
- **Lines**: 91.86%

**Coverage Areas**:
- ✅ Redux Slices: Comprehensive unit tests for all actions and reducers
- ✅ Components: Full component test coverage with user interactions
- ✅ Pages: Complete page-level testing
- ✅ Integration Tests: End-to-end UI behavior (search, filter, favorite)
- ✅ Utilities: All utility functions tested
- ✅ Selectors: All Redux selectors tested

**Test Files**:
- `src/store/slices/__tests__/` - Redux slice tests
- `src/components/__tests__/` - Component tests
- `src/pages/__tests__/` - Page tests
- `src/utils/__tests__/` - Utility tests
- `src/__tests__/integration.test.tsx` - Integration tests
- `src/store/__tests__/selectors.test.ts` - Selector tests

### Test Coverage Reports for Deployment

**Generating Coverage Reports**:

```bash
# Generate coverage report
npm run test:coverage
```

**Coverage Report Location**:
- HTML Report: `coverage/lcov-report/index.html`
- LCOV Report: `coverage/lcov.info`
- JSON Report: `coverage/coverage-final.json`

**For Deployment Submission**:
1. Run `npm run test:coverage` to generate the coverage report
2. The `coverage/` folder contains all coverage reports
3. Open `coverage/lcov-report/index.html` in a browser to view detailed coverage
4. Include the coverage folder or screenshots of the coverage report in your submission

**Current Coverage Summary**:
- ✅ All 126 tests passing
- ✅ 22 test suites passing
- ✅ 89.69% statement coverage
- ✅ 85.34% branch coverage
- ✅ 90.69% function coverage
- ✅ 91.86% line coverage

## 🚢 Deployment

### Deploy to Vercel

#### Quick Deploy

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/product-dashboard.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Import your `product-dashboard` repository
   - Vercel auto-detects Create React App settings:
     - Framework Preset: Create React App
     - Build Command: `npm run build`
     - Output Directory: `build`
   - Click "Deploy"
   - Your app will be live in ~2 minutes!

#### Vercel Configuration

The project is configured for Vercel deployment:
- Framework: Create React App
- Build Command: `npm run build`
- Output Directory: `build`
- Automatic deployments on every push to main branch

#### Environment Variables

No environment variables required for this project.

### Alternative Deployment Platforms

#### Netlify

1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Configure redirects: `/* /index.html 200`

#### Render

1. Connect GitHub repository
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Set static publish directory: `build`

## 📝 API Information

The application uses the [Fake Store API](https://fakestoreapi.com):

- **Base URL**: `https://fakestoreapi.com`
- **Endpoints**:
  - `GET /products` - Get all products
  - `GET /products/:id` - Get single product
  - `GET /products/categories` - Get all categories

**Note**: This is a free public API. No authentication required.

## 🔧 Development Notes

### Code Structure

- **Clean Architecture**: Separation of concerns with components, pages, store, and utils
- **Type Safety**: Full TypeScript implementation with proper types
- **Reusable Components**: Modular component design
- **Custom Hooks**: Typed Redux hooks for better developer experience
- **Error Handling**: Proper error boundaries and error states
- **Loading States**: Loading indicators for async operations

### Best Practices Implemented

- ✅ Functional components with hooks
- ✅ Proper error handling and error boundaries
- ✅ Loading states for async operations
- ✅ Debounced search for performance optimization
- ✅ Memoization with `useMemo` and `createSelector`
- ✅ TypeScript for type safety
- ✅ Responsive design with mobile-first approach
- ✅ Accessibility features (ARIA labels, semantic HTML)
- ✅ Code splitting with React.lazy
- ✅ Comprehensive testing

### Key Implementation Details

1. **Debounced Search**: Search input is debounced (300ms) to reduce unnecessary re-renders
2. **Memoized Selectors**: Redux selectors use `createSelector` for performance
3. **Error Boundaries**: React ErrorBoundary component catches errors
4. **Lazy Loading**: Pages are lazy-loaded for better performance
5. **Type Safety**: Full TypeScript coverage with proper interfaces

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is in use, React will prompt to use a different port automatically.

### API Errors

If the Fake Store API is down:
- Check the network tab in browser DevTools
- Verify the API is accessible: `https://fakestoreapi.com/products`
- The app will display error messages if API calls fail

### Test Failures

Ensure all dependencies are installed:
```bash
npm install
```

If tests fail, try:
```bash
npm test -- --clearCache
```

### Build Errors

If build fails:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📄 License

This project is created for educational/demonstration purposes.

## 👤 Author

Built as part of a Frontend Developer assignment demonstrating proficiency in:
- React with functional components and hooks
- Redux Toolkit for state management
- Comprehensive testing with Jest and React Testing Library
- Modern frontend best practices

---

**Live Demo**: [Deployed on Vercel](#-deployment)

**Test Coverage**: Run `npm run test:coverage` to generate detailed coverage reports

**Happy Coding! 🚀**
