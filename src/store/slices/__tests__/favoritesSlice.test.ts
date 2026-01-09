import favoritesReducer, {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
} from '../favoritesSlice';

describe('favoritesSlice', () => {
  const initialState = {
    favoriteIds: [],
  };

  it('should return the initial state', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addToFavorites', () => {
    const actual = favoritesReducer(initialState, addToFavorites(1));
    expect(actual.favoriteIds).toEqual([1]);
  });

  it('should not add duplicate favorites', () => {
    const stateWithFavorite = { favoriteIds: [1] };
    const actual = favoritesReducer(stateWithFavorite, addToFavorites(1));
    expect(actual.favoriteIds).toEqual([1]);
  });

  it('should handle removeFromFavorites', () => {
    const stateWithFavorites = { favoriteIds: [1, 2, 3] };
    const actual = favoritesReducer(stateWithFavorites, removeFromFavorites(2));
    expect(actual.favoriteIds).toEqual([1, 3]);
  });

  it('should handle toggleFavorite - add', () => {
    const actual = favoritesReducer(initialState, toggleFavorite(1));
    expect(actual.favoriteIds).toEqual([1]);
  });

  it('should handle toggleFavorite - remove', () => {
    const stateWithFavorite = { favoriteIds: [1, 2] };
    const actual = favoritesReducer(stateWithFavorite, toggleFavorite(1));
    expect(actual.favoriteIds).toEqual([2]);
  });

  it('should handle multiple addToFavorites', () => {
    let state = initialState;
    state = favoritesReducer(state, addToFavorites(1));
    state = favoritesReducer(state, addToFavorites(2));
    state = favoritesReducer(state, addToFavorites(3));
    
    expect(state.favoriteIds).toEqual([1, 2, 3]);
  });

  it('should handle multiple removeFromFavorites', () => {
    const stateWithFavorites = { favoriteIds: [1, 2, 3, 4, 5] };
    let state = stateWithFavorites;
    state = favoritesReducer(state, removeFromFavorites(2));
    state = favoritesReducer(state, removeFromFavorites(4));
    
    expect(state.favoriteIds).toEqual([1, 3, 5]);
  });

  it('should handle toggleFavorite multiple times', () => {
    let state = initialState;
    state = favoritesReducer(state, toggleFavorite(1));
    expect(state.favoriteIds).toEqual([1]);
    
    state = favoritesReducer(state, toggleFavorite(1));
    expect(state.favoriteIds).toEqual([]);
    
    state = favoritesReducer(state, toggleFavorite(1));
    expect(state.favoriteIds).toEqual([1]);
  });

  it('should handle removeFromFavorites with non-existent id', () => {
    const stateWithFavorites = { favoriteIds: [1, 2, 3] };
    const actual = favoritesReducer(stateWithFavorites, removeFromFavorites(5));
    expect(actual.favoriteIds).toEqual([1, 2, 3]);
  });

  it('should maintain order when adding favorites', () => {
    let state = initialState;
    state = favoritesReducer(state, addToFavorites(3));
    state = favoritesReducer(state, addToFavorites(1));
    state = favoritesReducer(state, addToFavorites(2));
    
    expect(state.favoriteIds).toEqual([3, 1, 2]);
  });
});
