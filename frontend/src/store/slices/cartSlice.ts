import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, CartItem } from '../../types';

interface CartState {
    items: CartItem[];
    total: number;
}

const loadCartFromStorage = (): CartItem[] => {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch {
        return [];
    }
};

const saveCartToStorage = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
};

const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
};

const initialState: CartState = {
    items: loadCartFromStorage(),
    total: calculateTotal(loadCartFromStorage()),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(
                (item) => item.product.id === product.id
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ product, quantity });
            }

            state.total = calculateTotal(state.items);
            saveCartToStorage(state.items);
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(
                (item) => item.product.id !== action.payload
            );
            state.total = calculateTotal(state.items);
            saveCartToStorage(state.items);
        },

        updateQuantity: (
            state,
            action: PayloadAction<{ productId: string; quantity: number }>
        ) => {
            const item = state.items.find(
                (item) => item.product.id === action.payload.productId
            );

            if (item) {
                if (action.payload.quantity <= 0) {
                    state.items = state.items.filter(
                        (i) => i.product.id !== action.payload.productId
                    );
                } else {
                    item.quantity = action.payload.quantity;
                }
            }

            state.total = calculateTotal(state.items);
            saveCartToStorage(state.items);
        },

        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            localStorage.removeItem('cart');
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
