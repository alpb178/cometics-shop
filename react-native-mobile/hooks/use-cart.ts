import { useCallback, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  currency?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
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
        };
      } else {
        const newItem = { ...item, quantity: 1 };
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
        };
      });
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0,
    });
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
