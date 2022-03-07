import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../app/api";
export interface ProductsState {
  products: Product[];
}
const initialState: ProductsState = {
  products: [],
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    receivedProducts(state, action: PayloadAction<Product[]>) {
      const products = action.payload;
      products.forEach((product) => {
        state.products.push(product);
      });
    },
  },
});
export const { receivedProducts } = productsSlice.actions;
export default productsSlice.reducer;
