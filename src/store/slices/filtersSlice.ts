import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState } from '../../types';

const initialState: FilterState = {
  searchQuery: '',
  category: '',
  sortBy: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.category = '';
      state.sortBy = '';
    },
  },
});

export const { setSearchQuery, setCategory, setSortBy, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
