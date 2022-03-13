import cartReducer, {
  addToCart,
  CartState,
  getNumItems,
  removeFromCart,
  updateQuantity,
  getMemoizedNumItems,
  getTotalPrice,
  checkoutCart,
} from "./cartSlice";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import * as api from "../../app/api";
jest.mock("../../app/api", () => {
  return {
    async getProducts() {},
    async checkout(items = {} as api.CartItems) {
      if (!items) {
        throw new Error("No items provided");
      }
      return { success: true, error: "" };
    },
  };
});
// test("checkout should work", async () => {
//   await api.checkout();
// });
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
        items: [
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
      };
      expect(getMemoizedNumItems({ cart } as RootState)).toBe(5);
    });
    test("should not compute again with same state", () => {
      const cart: CartState = {
        items: [
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
      };
      getMemoizedNumItems.resetRecomputations();
      getMemoizedNumItems({ cart } as RootState);
      expect(getMemoizedNumItems.recomputations()).toBe(1);
      getMemoizedNumItems({ cart } as RootState);
      expect(getMemoizedNumItems.recomputations()).toBe(1);
    });
    test("should recompute with new state", () => {
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
    });
  });
  describe("getTotalPrice", function () {
    it("should return 0 if there are no items", () => {
      const cart: CartState = {
        items: [],
        checkoutState: "READY",
        errorMessage: "",
      };
      expect(getTotalPrice({ cart } as RootState)).toBe("0.00");
    });
    it("should add up the totals", () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            name: "test",
            price: 5,
            quantity: 2,
          },
          {
            id: 2,
            name: "test",
            price: 5,
            quantity: 3,
          },
        ],
        checkoutState: "READY",
        errorMessage: "",
      };
      expect(getTotalPrice({ cart: state } as RootState)).toBe("25.00");
    });
    it("should not compute again with sam state", () => {
      const cart: CartState = {
        items: [
          {
            id: 1,
            name: "test",
            price: 5,
            quantity: 2,
          },
          {
            id: 2,
            name: "test",
            price: 5,
            quantity: 3,
          },
        ],
        checkoutState: "READY",
        errorMessage: "",
      };
      getTotalPrice.resetRecomputations();
      getTotalPrice({ cart } as RootState);
      expect(getTotalPrice.recomputations()).toBe(1);
      getTotalPrice({ cart } as RootState);
      expect(getTotalPrice.recomputations()).toBe(1);
    });
    it("should recompute with new products", () => {
      const cart: CartState = {
        items: [
          {
            id: 1,
            name: "test",
            price: 5,
            quantity: 2,
          },
          {
            id: 2,
            name: "test",
            price: 5,
            quantity: 3,
          },
        ],
        checkoutState: "READY",
        errorMessage: "",
      };
      getTotalPrice.resetRecomputations();
      getTotalPrice({ cart } as RootState);
      expect(getTotalPrice.recomputations()).toBe(1);
      cart.items = [
        {
          id: 1,
          name: "test",
          price: 5,
          quantity: 8,
        },
      ];
      getTotalPrice({ cart } as RootState);
      getTotalPrice({ cart } as RootState);
      getTotalPrice({ cart } as RootState);
      expect(getTotalPrice.recomputations()).toBe(2);

      cart.items = [];
      let result = getTotalPrice({ cart } as RootState);
      expect(result).toBe("0.00");
      expect(getTotalPrice.recomputations()).toBe(3);
    });
  });
});
describe("thunks", function () {
  describe("checkoutCart w/mocked dispatch", function () {
    it("should checkout", async () => {
      const dispatch = jest.fn();
      const state: RootState = {
        products: { products: {} },
        cart: {
          items: [
            {
              id: 1,
              name: "test",
              price: 5,
              quantity: 2,
            },
            {
              id: 2,
              name: "test",
              price: 5,
              quantity: 3,
            },
          ],
          checkoutState: "READY",
          errorMessage: "",
        },
      };
      const thunk = checkoutCart();
      await thunk(dispatch, () => state, undefined);
      const { calls } = dispatch.mock;
      expect(calls).toHaveLength(2);
      expect(calls[0][0].type).toEqual("cart/checkout/pending");
      expect(calls[1][0].type).toEqual("cart/checkout/fulfilled");
      expect(calls[1][0].payload).toEqual({ success: true, error: "" });
    });
    it("should fail with no items", async () => {
      const dispatch = jest.fn();
      const state: RootState = {
        products: { products: {} },
        cart: {
          items: [],
          checkoutState: "READY",
          errorMessage: "",
        },
      };
      const thunk = checkoutCart();
      await thunk(dispatch, () => state, undefined);
      const { calls } = dispatch.mock;
      expect(calls).toHaveLength(2);
      expect(calls[0][0].type).toEqual("cart/checkout/pending");
      expect(calls[1][0].type).toEqual("cart/checkout/rejected");
      expect(calls[1][0].payload).toEqual(undefined);
      expect(calls[1][0].error.message).toEqual('Must include cart items');
    });
  });
});
