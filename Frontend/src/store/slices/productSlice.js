import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  filters: {
    category: null,
    priceRange: {
      min: 0,
      max: Infinity,
    },
    searchQuery: '',
  },
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    fetchProductsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Apply filters
      state.filteredProducts = state.products.filter((product) => {
        const matchesCategory =
          !state.filters.category ||
          product.category.toLowerCase() === state.filters.category.toLowerCase();
        const matchesPriceRange =
          product.price >= state.filters.priceRange.min &&
          product.price <= state.filters.priceRange.max;
        const matchesSearch =
          !state.filters.searchQuery ||
          product.name
            .toLowerCase()
            .includes(state.filters.searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(state.filters.searchQuery.toLowerCase());

        return matchesCategory && matchesPriceRange && matchesSearch;
      });
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredProducts = state.products;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setSelectedProduct,
  setFilters,
  clearFilters,
} = productSlice.actions;

export default productSlice.reducer; 