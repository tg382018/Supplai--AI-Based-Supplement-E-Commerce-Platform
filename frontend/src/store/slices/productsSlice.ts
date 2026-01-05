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
        params: { search?: string; categoryId?: string; page?: number; includeInactive?: boolean } = {},
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

export const addProduct = createAsyncThunk(
    'products/addProduct',
    async (data: Partial<Product>, { rejectWithValue }) => {
        try {
            const product = await productService.createProduct(data);
            return product;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add product');
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, data }: { id: string; data: Partial<Product> }, { rejectWithValue }) => {
        try {
            const product = await productService.updateProduct(id, data);
            return product;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update product');
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id: string, { rejectWithValue }) => {
        try {
            await productService.deleteProduct(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
        }
    }
);

export const addCategory = createAsyncThunk(
    'products/addCategory',
    async (data: Partial<Category>, { rejectWithValue }) => {
        try {
            const category = await productService.createCategory(data);
            return category;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add category');
        }
    }
);

export const updateCategory = createAsyncThunk(
    'products/updateCategory',
    async ({ id, data }: { id: string; data: Partial<Category> }, { rejectWithValue }) => {
        try {
            const category = await productService.updateCategory(id, data);
            return category;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update category');
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'products/deleteCategory',
    async (id: string, { rejectWithValue }) => {
        try {
            await productService.deleteCategory(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
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
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.unshift(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter((p) => p.id !== action.payload);
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter((c) => c.id !== action.payload);
            });
    },
});

export const { setSearch, setCategory, setPage } = productsSlice.actions;
export default productsSlice.reducer;
