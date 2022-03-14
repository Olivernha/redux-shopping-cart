import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import cartReducer from "../features/cart/cartSlice";
import productsReducer from "../features/products/productsSlice";
const reducer = {
  products: productsReducer,
  cart: cartReducer,
};
export const store = configureStore({
  reducer,
});
export function getStoreWithState(preloadedState?: RootState) {
  return configureStore({
    reducer,
    preloadedState,
  });
}
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
