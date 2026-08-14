import { createSlice } from '@reduxjs/toolkit';

const CART_KEY = 'novacart_cart';

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch { /* storage full – silently fail */ }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.productId === product._id);
      const qty = Number(quantity);

      if (existing) {
        const newQty = existing.quantity + qty;
        if (newQty > product.quantity) return; // stock guard
        existing.quantity = newQty;
      } else {
        if (qty > product.quantity) return; // stock guard
        state.items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: qty,
          stock: product.quantity,
        });
      }
      saveToStorage(state.items);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity, stock } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (!item) return;
      const qty = Number(quantity);
      if (qty <= 0) {
        state.items = state.items.filter((i) => i.productId !== productId);
      } else {
        if (stock !== undefined && qty > stock) return;
        item.quantity = qty;
      }
      saveToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      try { localStorage.removeItem(CART_KEY); } catch { /* */ }
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal = (state) =>
  parseFloat(
    state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
  );
export const selectCartItemById = (productId) => (state) =>
  state.cart.items.find((i) => i.productId === productId);

export default cartSlice.reducer;
