import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addressService, type Address } from '../../services/addressService';

interface AddressState {
    addresses: Address[];
    loading: boolean;
    error: string | null;
}

const initialState: AddressState = {
    addresses: [],
    loading: false,
    error: null,
};

export const fetchAddresses = createAsyncThunk(
    'addresses/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            return await addressService.getAll();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
        }
    }
);

export const addAddress = createAsyncThunk(
    'addresses/addAddress',
    async (address: Omit<Address, 'id'>, { rejectWithValue }) => {
        try {
            return await addressService.create(address);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add address');
        }
    }
);

export const deleteAddress = createAsyncThunk(
    'addresses/deleteAddress',
    async (id: string, { rejectWithValue }) => {
        try {
            await addressService.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
        }
    }
);

const addressSlice = createSlice({
    name: 'addresses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.addresses.push(action.payload);
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.filter((a) => a.id !== action.payload);
            });
    },
});

export default addressSlice.reducer;
