import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import type { Product } from "../../app/api";
export interface CartState {
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
}
const initialState: CartState = {
  items: [],
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateQuantity(
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    addToCart(state, action: PayloadAction<Product>) {
      const { id, name, price } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) {
        state.items.push({
          id,
          price,
          quantity: 1,
          name,
        });
      } else {
        existingItem.quantity++;
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity--;
        if (item.quantity === 0) {
          state.items = state.items.filter((item) => item.id !== id);
        }
      }
    },
  },
});
export const { addToCart, removeFromCart,updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
export function getNumItems(state: RootState) {
  console.log("calledNum");
  return state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
export const getMemoizedNumItems = createSelector(
  (state: RootState) => state.cart.items,
  (items) => {
    console.log("calledNum");
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
);
export const getTotalPrice = createSelector(
  (state: RootState) => state.cart.items,
  (items) => {
    console.log("calledTotal");
    return items
      .reduce((sum, item) => sum + item.quantity * item.price, 0)
      .toFixed(2);
  }
);
