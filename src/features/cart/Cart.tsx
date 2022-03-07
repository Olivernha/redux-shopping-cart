import React from "react";
import { useAppSelector ,useAppDispatch} from "../../app/hooks";
import { getTotalPrice, removeFromCart } from "./cartSlice";
import styles from "./Cart.module.css";

export function Cart() {
  const dispatch= useAppDispatch();
  const products = useAppSelector(state => state.products.products);
  const items = useAppSelector(state => state.cart.items)
  const totalPrice = useAppSelector(getTotalPrice);

  return (
    <main className="page">
      <h1>Shopping Cart</h1>
      <table className={styles.table}>
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
                <input type="text" className={styles.input} value={item.quantity}  />
              </td>
              <td>${item.price}</td>
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