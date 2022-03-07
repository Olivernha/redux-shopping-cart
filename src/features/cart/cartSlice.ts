import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
export interface CartState {
  items: {
    [productId: string]: number;
  };
}

const initialState: CartState = {
  items: {},
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.items[id]) {
        state.items[id]++;
      } else {
        state.items[id] = 1;
      }
    },
  },
});
export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
export function getNumItems(state: RootState) {
  console.log("calledNum");
  return Object.keys(state.cart.items).reduce(
    (sum, id) => sum + state.cart.items[id],
    0
  );
}
export const getMemoizedNumItems = createSelector(
  (state: RootState) => state.cart.items,
  (items) => {
    console.log("calledNum");
    return Object.keys(items).reduce((sum, id) => sum + items[id], 0);
  }
);
