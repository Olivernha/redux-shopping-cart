import React from "react";
import classNames from 'classnames'
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getTotalPrice, removeFromCart, updateQuantity } from "./cartSlice";
import styles from "./Cart.module.css";

export function Cart() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products.products);
  const items = useAppSelector(state => state.cart.items)
  const totalPrice = useAppSelector(getTotalPrice);
  const checkoutState = useAppSelector((state) => state.cart.checkoutState)
  const onQuantityChanged = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const quantity = +e.target.value || 0;
    dispatch(updateQuantity({ id, quantity }));
  }
  const tableClasses = classNames({
    [styles.table]:true,
    [styles.checkoutError]:checkoutState === "ERROR",
    [styles.checkoutLoading]: checkoutState === "LOADING"
  })
  return (
    <main className="page">
      <h1>Shopping Cart</h1>
      <table className={tableClasses}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <input type="text" className={styles.input} value={item.quantity} onChange={(e) => onQuantityChanged(e, item.id)}
                />
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button aria-label={`Remove ${item.name} from Shopping Cart`} onClick={() => dispatch(removeFromCart(item.id))}>
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td className={styles.total}>${totalPrice}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <form>
        <button className={styles.button} type="submit">
          Checkout
        </button>
      </form>
    </main>
  );
}