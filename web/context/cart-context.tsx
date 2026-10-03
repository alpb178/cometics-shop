"use client";

import { Product } from "@/definitions/Product";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

const CART_STORAGE_KEY = "iris-natural-cart";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  updateQuantity: (_product: Product, _quantity: number) => void;
  addToCart: (_product: Product) => void;
  removeFromCart: (_productId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
};

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        item &&
        typeof item === "object" &&
        typeof item.quantity === "number" &&
        item.product &&
        typeof item.product.id === "number" &&
        typeof item.product.price === "number"
    );
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota or serialization errors
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const hasLoadedFromStorage = useRef(false);

  useEffect(() => {
    if (!hasLoadedFromStorage.current) {
      const stored = loadCartFromStorage();
      setItems(stored);
      hasLoadedFromStorage.current = true;
      return;
    }
    saveCartToStorage(items);
  }, [items]);

  const addToCart = useCallback((product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const updateQuantity = useCallback((product: Product, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === product.id ? { ...item, quantity } : item
      )
    );
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        updateQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
