import cartReducer, {
  addToCart,
  CartState,
  removeFromCart,
  updateQuantity,
} from "./cartSlice";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

describe("cart reducer", function () {
  test("an empty action", function () {
    const initialState = undefined;
    const action = {} as ActionCreatorWithoutPayload;
    const state = cartReducer(initialState, action);
    expect(state).toEqual({
      checkoutState: "READY",
      errorMessage: "",
      items: [],
    });
  });
  test("addToCart", function () {
    const initialState = undefined;
    const action = addToCart({
      id: 1,
      name: "test",
      price: 1,
    });
    let state = cartReducer(initialState, action);
    expect(state).toEqual({
      checkoutState: "READY",
      errorMessage: "",
      items: [
        {
          id: 1,
          name: "test",
          price: 1,
          quantity: 1,
        },
      ],
    });
    state = cartReducer(state, action);
    state = cartReducer(state, action);
    expect(state).toEqual({
      checkoutState: "READY",
      errorMessage: "",
      items: [
        {
          id: 1,
          name: "test",
          price: 1,
          quantity: 3,
        },
      ],
    });
  });
  test("removeFromCart", () => {
    const initialState: CartState = {
      items: [
        {
          id: 1,
          name: "test",
          price: 1,
          quantity: 3,
        },
      ],
      checkoutState: "READY",
      errorMessage: "",
    };
    const state = cartReducer(initialState, removeFromCart(1));
    expect(state).toEqual({
      items: [
        {
          id: 1,
          name: "test",
          price: 1,
          quantity: 2,
        },
      ],
      checkoutState: "READY",
      errorMessage: "",
    });
  });
  test('updateQuantity',() =>{
    const initialState: CartState = {
      items: [
        {
          id: 1,
          name: "test",
          price: 1,
          quantity: 3,
        },
      ],
      checkoutState: "READY",
      errorMessage: "",
    };
    const state = cartReducer(initialState, updateQuantity({id: 1, quantity: 5}));
    expect(state).toEqual({
      items: [
        {
          id: 1,
          name: "test",
          price: 1,
          quantity: 5,
        },
      ],
      checkoutState: "READY",
      errorMessage: "",
    });
  })
});
