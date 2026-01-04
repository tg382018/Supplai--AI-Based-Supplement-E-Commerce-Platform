import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../../services';
import type { Product, Category, PaginatedResponse } from '../../types';

interface ProductsState {
    products: Product[];
    featured: Product[];
    categories: Category[];
    selectedCategory: string | null;
    search: string;
    currentPage: number;
    totalPages: number;
    total: number;
    loading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    products: [],
    featured: [],
    categories: [],
    selectedCategory: null,
    search: '',
    currentPage: 1,
    totalPages: 1,
    total: 0,
    loading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (
        params: { search?: string; categoryId?: string; page?: number } = {},
        { rejectWithValue }
    ) => {
        try {
            const response = await productService.getProducts(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

export const fetchFeatured = createAsyncThunk(
    'products/fetchFeatured',
    async (_, { rejectWithValue }) => {
        try {
            const products = await productService.getFeatured();
            return products;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured');
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'products/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const categories = await productService.getCategories();
            return categories;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
            state.currentPage = 1;
        },
        setCategory: (state, action: PayloadAction<string | null>) => {
            state.selectedCategory = action.payload;
            state.currentPage = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<PaginatedResponse<Product>>) => {
                state.loading = false;
                state.products = action.payload.data;
                state.currentPage = action.payload.meta.page;
                state.totalPages = action.payload.meta.totalPages;
                state.total = action.payload.meta.total;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchFeatured.fulfilled, (state, action) => {
                state.featured = action.payload;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            });
    },
});

export const { setSearch, setCategory, setPage } = productsSlice.actions;
export default productsSlice.reducer;
