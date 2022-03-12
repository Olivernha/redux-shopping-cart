import { createSlice, PayloadAction, createAsyncThunk,createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Product ,checkout} from "../../app/api";

type CheckoutState = "LOADING" | "READY" | "ERROR";
export interface CartState {
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  checkoutState: CheckoutState;
  errorMessage:string
}
const initialState: CartState = {
  items: [],
  checkoutState: "READY",
  errorMessage:""
};

export const checkoutCart = createAsyncThunk("cart/checkout", async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const items = state.cart.items;
  const response = await checkout(items);
  console.log(response);
  return response;
});

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
    addToCart(state, action: PayloadAction<{ id: number; name: string , price: number }>) {
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
    builder.addCase(checkoutCart.pending,(state)=>{
      state.checkoutState = "LOADING"
    })
    builder.addCase(
      checkoutCart.fulfilled,
      (state, action: PayloadAction<{ success: boolean }>) => {
        const { success } = action.payload;
        if (success) {
          state.checkoutState = "READY";
          state.items = [];
        } else {
          state.checkoutState = "ERROR";
        }
      }
    );
    builder.addCase(checkoutCart.rejected,(state,action) => {
      state.checkoutState = "ERROR"
      state.errorMessage = action.error.message || ""
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
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
);
export const getTotalPrice = createSelector(
  (state: RootState) => state.cart.items,
  (items) => {
    return items
      .reduce((sum, item) => sum + item.quantity * item.price, 0)
      .toFixed(2);
  }
);
