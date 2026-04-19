import React, { createContext, useContext, useCallback, useState, ReactNode } from "react";

export type DeliveryOption = "delivery" | "pickup";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  currency?: string;
  deliveryOption?: DeliveryOption;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  deliveryOption: DeliveryOption;
}

interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateDeliveryOption: (option: DeliveryOption) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
    deliveryOption: "delivery",
  });

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        const updatedItems = prevCart.items.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );

        const total = updatedItems.reduce(
          (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
          0
        );
        const itemCount = updatedItems.reduce(
          (sum, cartItem) => sum + cartItem.quantity,
          0
        );

        return {
          items: updatedItems,
          total,
          itemCount,
          deliveryOption: prevCart.deliveryOption,
        };
      } else {
        const newItem = { 
          ...item, 
          quantity: 1,
          deliveryOption: item.deliveryOption || prevCart.deliveryOption,
        };
        const updatedItems = [...prevCart.items, newItem];
        const total = updatedItems.reduce(
          (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
          0
        );
        const itemCount = updatedItems.reduce(
          (sum, cartItem) => sum + cartItem.quantity,
          0
        );

        return {
          items: updatedItems,
          total,
          itemCount,
          deliveryOption: prevCart.deliveryOption,
        };
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item.id !== itemId);
      const total = updatedItems.reduce(
        (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
        0
      );
      const itemCount = updatedItems.reduce(
        (sum, cartItem) => sum + cartItem.quantity,
        0
      );

      return {
        items: updatedItems,
        total,
        itemCount,
        deliveryOption: prevCart.deliveryOption,
      };
    });
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(itemId);
        return;
      }

      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        const total = updatedItems.reduce(
          (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
          0
        );
        const itemCount = updatedItems.reduce(
          (sum, cartItem) => sum + cartItem.quantity,
          0
        );

        return {
          items: updatedItems,
          total,
          itemCount,
          deliveryOption: prevCart.deliveryOption,
        };
      });
    },
    [removeFromCart]
  );

  const updateDeliveryOption = useCallback((option: DeliveryOption) => {
    setCart((prevCart) => ({
      ...prevCart,
      deliveryOption: option,
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0,
      deliveryOption: "delivery",
    });
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, updateDeliveryOption, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

