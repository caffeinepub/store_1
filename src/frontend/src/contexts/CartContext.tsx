import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Color, Product, Size } from "../backend";

export interface CartItem {
  product: Product;
  size: Size;
  color: Color;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    size: Size,
    color: Color,
    quantity: number,
  ) => void;
  removeFromCart: (productId: string, size: Size, color: Color) => void;
  updateQuantity: (
    productId: string,
    size: Size,
    color: Color,
    quantity: number,
  ) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function bigintReplacer(_key: string, value: unknown) {
  if (typeof value === "bigint") {
    return { __bigint__: value.toString() };
  }
  return value;
}

function bigintReviver(_key: string, value: unknown) {
  if (value && typeof value === "object" && "__bigint__" in (value as object)) {
    return BigInt((value as { __bigint__: string }).__bigint__);
  }
  return value;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved, bigintReviver) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items, bigintReplacer));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [items]);

  const addToCart = (
    product: Product,
    size: Size,
    color: Color,
    quantity: number,
  ) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color,
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, size, color, quantity }];
    });
  };

  const removeFromCart = (productId: string, size: Size, color: Color) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.size === size &&
            item.color === color
          ),
      ),
    );
  };

  const updateQuantity = (
    productId: string,
    size: Size,
    color: Color,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        item.size === size &&
        item.color === color
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce(
      (total, item) => total + Number(item.product.price) * item.quantity,
      0,
    );
  };

  const getCartItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
