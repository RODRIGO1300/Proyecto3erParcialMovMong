import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "@shop_app_cart";

const normalizeProduct = (product) => ({
  id: product.id,
  title: product.title ?? product.name ?? "Producto",
  price: Number(product.price ?? 0),
  image: product.image,
  category: product.category ?? "",
});

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedItems = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedItems) {
          setItems(JSON.parse(storedItems));
        }
      } catch (error) {
        setItems([]);
      } finally {
        setIsReady(true);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [isReady, items]);

  const addToCart = (product) => {
    const normalizedProduct = normalizeProduct(product);

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === normalizedProduct.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === normalizedProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...normalizedProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const incrementQuantity = (productId) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (productId) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const cartTotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      incrementQuantity,
      decrementQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isReady,
    }),
    [items, cartCount, cartTotal, isReady]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider.");
  }

  return context;
}
