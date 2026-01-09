import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoritesState } from '../../types';

const initialState: FavoritesState = {
  favoriteIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<number>) => {
      if (!state.favoriteIds.includes(action.payload)) {
        state.favoriteIds.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.favoriteIds = state.favoriteIds.filter(id => id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const index = state.favoriteIds.indexOf(action.payload);
      if (index > -1) {
        state.favoriteIds.splice(index, 1);
      } else {
        state.favoriteIds.push(action.payload);
      }
    },
  },
});

export const { addToFavorites, removeFromFavorites, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
