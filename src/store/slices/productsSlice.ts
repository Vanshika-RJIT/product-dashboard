import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductsState } from '../../types';
import { api } from '../../utils/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    return await api.getProducts();
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    return await api.getCategories();
  }
);

const initialState: ProductsState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      })

      // categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export default productsSlice.reducer;
