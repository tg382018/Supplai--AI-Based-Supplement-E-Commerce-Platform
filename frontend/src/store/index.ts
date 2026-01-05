import { configureStore } from '@reduxjs/toolkit';
import { authReducer, cartReducer, productsReducer, addressReducer, supportReducer } from './slices';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        products: productsReducer,
        addresses: addressReducer,
        support: supportReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
