import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice';
import categoryReducer from '../features/categories/categorySlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/orders/orderSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});
