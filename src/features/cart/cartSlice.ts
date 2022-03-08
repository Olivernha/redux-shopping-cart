import { createSlice, PayloadAction, createAsyncThunk,createSelector } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../app/store";
import { Product ,CartItems,checkout} from "../../app/api";

type CheckoutState = "LOADING" | "READY" | "ERROR";
export interface CartState {
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  checkoutState: CheckoutState;
}
const initialState: CartState = {
  items: [],
  checkoutState: "READY",
};

export const checkoutCart = createAsyncThunk("cart/checkout",async(items:CartItems)=>{
  const response = await checkout(items);
  return response;
})

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
  extraReducers:function(builder){
    builder.addCase(checkoutCart.pending,(state,action)=>{
      state.checkoutState = "LOADING"
    })
    builder.addCase(checkoutCart.fulfilled,(state,action)=>{
      state.checkoutState = "READY"
    })
    builder.addCase(checkoutCart.rejected,(state,action) => {
      state.checkoutState = "ERROR"
    })
  }
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
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
