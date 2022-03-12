import cartReducer, {
  addToCart,
  CartState,
  getNumItems,
  removeFromCart,
  updateQuantity,
  getMemoizedNumItems,
} from "./cartSlice";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

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
  test("updateQuantity", () => {
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
    const state = cartReducer(
      initialState,
      updateQuantity({ id: 1, quantity: 5 })
    );
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
  });
});
describe("selectors", function () {
  describe("getNumItem", () => {
    test("should return 0 if there are no items", () => {
      const cart: CartState = {
        items: [],
        checkoutState: "READY",
        errorMessage: "",
      };
      expect(getNumItems({ cart } as RootState)).toBe(0);
    });
    test("should add up the total", () => {
      const cart: CartState = {
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
      expect(getNumItems({ cart } as RootState)).toBe(3);
    });
  });
  describe("getMemorizedNumItems", function () {
    it("should return 0 if there are no items", () => {
      const cart: CartState = {
        items: [],
        checkoutState: "READY",
        errorMessage: "",
      };
      expect(getMemoizedNumItems({ cart } as RootState)).toBe(0);
    });
    test("should add up the total", () => {
      const cart: CartState = {
        items:[
          {
            id: 1,
            name: "test",
            price: 1,
            quantity: 2,
          },
          {
            id: 2,
            name: "test",
            price: 1,
            quantity: 3,
          },
        ],
        checkoutState: "READY",
        errorMessage: "",
      }
      expect(getMemoizedNumItems({ cart } as RootState)).toBe(5);
    });
    test('should not compute again with same state',()=>{
      const cart: CartState = {
        items:[
          {
            id: 1,
            name: "test",
            price: 1,
            quantity: 2,
          },
          {
            id: 2,
            name: "test",
            price: 1,
            quantity: 3,
          },
        ],
        checkoutState: "READY",
        errorMessage: "",
      }
      getMemoizedNumItems.resetRecomputations();
      getMemoizedNumItems({ cart } as RootState);
      expect(getMemoizedNumItems.recomputations()).toBe(1);
      getMemoizedNumItems({ cart } as RootState);
      expect(getMemoizedNumItems.recomputations()).toBe(1);
    })
    test('should recompute with new state',() =>{
      const cart: CartState = {
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
      getMemoizedNumItems.resetRecomputations();
      getMemoizedNumItems({ cart } as RootState);
      expect(getMemoizedNumItems.recomputations()).toBe(1);
      cart.items = [
        {
          id: 1,
          name: "test",
          price: 1,
          quantity: 8,
        },
      ];
      getMemoizedNumItems({ cart } as RootState);
      expect(getMemoizedNumItems.recomputations()).toBe(2);
    })
  });
});