import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Color, Product, Size } from "../backend";

// A serialization-safe version of a cart product (no ExternalBlob instances)
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  sizes: Size[];
  colors: Color[];
  categoryId: string;
  description: string;
  featured: boolean;
}

export interface CartItem {
  product: CartProduct;
  size: Size;
  color: Color;
  quantity: number;
}

/** Convert a backend Product to a serialization-safe CartProduct */
export function toCartProduct(product: Product): CartProduct {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    imageUrls: product.images.map((img) => img.getDirectURL()),
    sizes: product.sizes,
    colors: product.colors,
    categoryId: product.categoryId,
    description: product.description,
    featured: product.featured,
  };
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved) as CartItem[];
      // Ensure price is always a number (guard against old BigInt-serialized data)
      return parsed.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: Number(item.product.price),
          imageUrls: Array.isArray(item.product.imageUrls)
            ? item.product.imageUrls
            : [],
        },
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
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
    const cartProduct = toCartProduct(product);
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === cartProduct.id &&
          item.size === size &&
          item.color === color,
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === cartProduct.id &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product: cartProduct, size, color, quantity }];
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
      (total, item) => total + item.product.price * item.quantity,
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
