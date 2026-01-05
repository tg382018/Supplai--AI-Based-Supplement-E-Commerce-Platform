import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../../services';
import type { Product, Category, PaginatedResponse } from '../../types';

interface FilterOptions {
    tags: string[];
    benefits: string[];
    priceRange: { min: number; max: number };
}

interface ProductsState {
    products: Product[];
    featured: Product[];
    categories: Category[];
    filterOptions: FilterOptions;
    selectedCategory: string | null;
    selectedTags: string[];
    selectedBenefits: string[];
    priceRange: [number, number];
    sortBy: string;
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
    filterOptions: {
        tags: [],
        benefits: [],
        priceRange: { min: 0, max: 1000 }
    },
    selectedCategory: null,
    selectedTags: [],
    selectedBenefits: [],
    priceRange: [0, 1000],
    sortBy: 'newest',
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
        params: {
            search?: string;
            categoryId?: string;
            tags?: string[];
            benefits?: string[];
            minPrice?: number;
            maxPrice?: number;
            sortBy?: string;
            page?: number;
            includeInactive?: boolean
        } = {},
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

export const fetchFilterOptions = createAsyncThunk(
    'products/fetchFilterOptions',
    async (_, { rejectWithValue }) => {
        try {
            const options = await productService.getFilterOptions();
            return options;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch filter options');
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

export const fetchCategories = createAsyncThunk<Category[], any | void>(
    'products/fetchCategories',
    async (params = {}, { rejectWithValue }) => {
        try {
            const categories = await productService.getCategories(params);
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
        setTags: (state, action: PayloadAction<string[]>) => {
            state.selectedTags = action.payload;
            state.currentPage = 1;
        },
        setBenefits: (state, action: PayloadAction<string[]>) => {
            state.selectedBenefits = action.payload;
            state.currentPage = 1;
        },
        setPriceRange: (state, action: PayloadAction<[number, number]>) => {
            state.priceRange = action.payload;
            state.currentPage = 1;
        },
        setSortBy: (state, action: PayloadAction<string>) => {
            state.sortBy = action.payload;
            state.currentPage = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        resetFilters: (state) => {
            state.selectedCategory = null;
            state.selectedTags = [];
            state.selectedBenefits = [];
            state.priceRange = [state.filterOptions.priceRange.min, state.filterOptions.priceRange.max];
            state.sortBy = 'newest';
            state.search = '';
            state.currentPage = 1;
        }
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
            .addCase(fetchFilterOptions.fulfilled, (state, action) => {
                state.filterOptions = action.payload;
                // Update initial price range if it hasn't been touched or is [0, 1000]
                if (state.priceRange[0] === 0 && state.priceRange[1] === 1000) {
                    state.priceRange = [action.payload.priceRange.min, action.payload.priceRange.max];
                }
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

export const {
    setSearch,
    setCategory,
    setTags,
    setBenefits,
    setPriceRange,
    setSortBy,
    setPage,
    resetFilters
} = productsSlice.actions;
export default productsSlice.reducer;
