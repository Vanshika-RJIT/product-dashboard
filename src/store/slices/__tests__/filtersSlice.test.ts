import filtersReducer, { setSearchQuery, setCategory, setSortBy, clearFilters } from '../filtersSlice';
import { FilterState } from '../../../types';

describe('filtersSlice', () => {
  const initialState: FilterState = {
    searchQuery: '',
    category: '',
    sortBy: '',
  };

  it('should return the initial state', () => {
    expect(filtersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setSearchQuery', () => {
    const actual = filtersReducer(initialState, setSearchQuery('laptop'));
    expect(actual.searchQuery).toEqual('laptop');
  });

  it('should handle setCategory', () => {
    const actual = filtersReducer(initialState, setCategory('electronics'));
    expect(actual.category).toEqual('electronics');
  });

  it('should handle setSortBy', () => {
    const actual = filtersReducer(initialState, setSortBy('price-asc'));
    expect(actual.sortBy).toEqual('price-asc');
  });

  it('should handle clearFilters', () => {
    const stateWithFilters: FilterState = {
      searchQuery: 'laptop',
      category: 'electronics',
      sortBy: 'price-asc',
    };
    const actual = filtersReducer(stateWithFilters, clearFilters());
    expect(actual).toEqual(initialState);
  });

  it('should handle setSearchQuery with empty string', () => {
    const stateWithQuery: FilterState = {
      searchQuery: 'laptop',
      category: '',
      sortBy: '',
    };
    const actual = filtersReducer(stateWithQuery, setSearchQuery(''));
    expect(actual.searchQuery).toEqual('');
  });

  it('should handle setSearchQuery with special characters', () => {
    const actual = filtersReducer(initialState, setSearchQuery('laptop & phone'));
    expect(actual.searchQuery).toEqual('laptop & phone');
  });

  it('should handle setCategory with empty string', () => {
    const stateWithCategory: FilterState = {
      searchQuery: '',
      category: 'electronics',
      sortBy: '',
    };
    const actual = filtersReducer(stateWithCategory, setCategory(''));
    expect(actual.category).toEqual('');
  });

  it('should handle all sortBy options', () => {
    const sortOptions: FilterState['sortBy'][] = ['price-asc', 'price-desc', 'title-asc', 'title-desc', ''];
    
    sortOptions.forEach(sortBy => {
      const actual = filtersReducer(initialState, setSortBy(sortBy));
      expect(actual.sortBy).toEqual(sortBy);
    });
  });

  it('should handle multiple filter changes', () => {
    let state = initialState;
    state = filtersReducer(state, setSearchQuery('laptop'));
    state = filtersReducer(state, setCategory('electronics'));
    state = filtersReducer(state, setSortBy('price-asc'));
    
    expect(state.searchQuery).toEqual('laptop');
    expect(state.category).toEqual('electronics');
    expect(state.sortBy).toEqual('price-asc');
    
    state = filtersReducer(state, clearFilters());
    expect(state).toEqual(initialState);
  });
});
