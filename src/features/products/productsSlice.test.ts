import productsReducer, { receivedProducts } from "./productsSlice";
import products from "../../../public/products.json";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
describe("products reducer", function () {
  it("should return the initial state when passed to an empty action", function () {
    const initialState = undefined;
    const action = {} as ActionCreatorWithoutPayload;
    const result = productsReducer(initialState, action);
    expect(result).toEqual({ products: {} });
  });
  it("should convert the products received to an object", () => {
    const initialState = undefined;
    const action = receivedProducts(products);
    const result = productsReducer(initialState, action);
    expect(Object.keys(result.products).length).toEqual(products.length);
    products.forEach((product) => {
      expect(result.products[product.id]).toEqual(product);
    });
  });
  it("should not allow the same products to be added more than once", () => {
    const initialState = undefined;
    const action = receivedProducts(products);
    let result = productsReducer(initialState, action);
    result = productsReducer(result, action);
    expect(Object.keys(result.products).length).toEqual(products.length);
  });
  it("should allow multiple products to be received at different times", () => {
    const initialState = undefined;
    const action1 = receivedProducts(products.slice(0, 2));
    let result = productsReducer(initialState, action1);
    const action2 = receivedProducts(products.slice(2, 4));
    result = productsReducer(result, action2);
    expect(Object.keys(result.products).length).toEqual(4);
  });
});
