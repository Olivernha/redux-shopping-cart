
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageURL: string;
  imageAlt: string;
  imageCredit: string;
}
export async function getProducts(): Promise<Product[]> {
  const results = await fetch("/products.json");
  const products = results.json();
  return products;
}

export type CartItems = {
  id: number;
  name: string;
  quantity: number;
  price: number;
}[];
export type CheckoutResponse = { success: boolean; error?: string };

export async function checkout(items: CartItems): Promise<CheckoutResponse> {
 
  // const modifier = items.length > 0 ? "success" : "error";
  // const url = `/checkout-${modifier}.json`;
  await sleep(500);
  // const response = await fetch(url, {
  //   method: "POST",
  //   body: JSON.stringify(items),
  // });
  // const data = await response.json();
  
  if (items.length === 0) {
    throw new Error('No items in cart');
  }
  return { success: true, error: ''} as CheckoutResponse;
}

// utility function to simulate slowness in an API call
const sleep = (time: number) => new Promise((res) => setTimeout(res, time));
