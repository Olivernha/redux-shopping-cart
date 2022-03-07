import React from "react";
import { useAppSelector } from "../../app/hooks";
import styles from "./Cart.module.css";

export function Cart() {
  const products = useAppSelector(state => state.products.products);
  const items = useAppSelector(state => state.cart.items)
  console.log(products);
  console.log(items);

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
            <tr>
              <td>{item.name}</td>
              <td>
                <input type="text" className={styles.input} defaultValue={item.quantity} />
              </td>
              <td>${item.price}</td>
              <td>
                <button aria-label={`Remove ${item.name} from Shopping Cart`}>
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
            <td className={styles.total}>${0.0}</td>
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