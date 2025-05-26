const CART_KEY = "cart";

export type CartItem = {
  id: number;
  name: string;
  gambar: string;
  quantity: number;
  harga: number;
};

// 🧠 Trigger event global
const triggerCartUpdated = () => {
  window.dispatchEvent(new Event("cartUpdated"));
};

export const getCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  triggerCartUpdated();
};

export const addToCart = (item: CartItem) => {
  const cart = getCart();
  const index = cart.findIndex((i) => i.id === item.id);

  if (index > -1) {
    cart[index].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
};

export const updateCartItem = (id: number, quantity: number) => {
  const cart = getCart();
  const updated = cart.map((item) =>
    item.id === id ? { ...item, quantity } : item
  );
  saveCart(updated);
};

export const removeFromCart = (id: number) => {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  triggerCartUpdated();
};

export const getCartCount = () => {
  return getCart().length;
};

// 🔁 Revisi: hitung total quantity, bukan panjang array
export const getLocalCartCount = (): number => {
  return getCartCount();
};
