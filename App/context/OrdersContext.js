import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ORDERS_STORAGE_KEY = "@shop_app_orders";

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      } catch (error) {
        setOrders([]);
      } finally {
        setIsReady(true);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [isReady, orders]);

  const createOrder = ({ userId, items, total }) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
      total,
      items,
    };

    setOrders((currentOrders) => [newOrder, ...currentOrders]);
    return newOrder;
  };

  const deleteOrder = (orderId) => {
    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== orderId)
    );
  };

  const getOrdersByUser = (userId) =>
    orders.filter((order) => order.userId === userId);

  const value = useMemo(
    () => ({
      orders,
      isReady,
      createOrder,
      deleteOrder,
      getOrdersByUser,
    }),
    [orders, isReady]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders debe usarse dentro de OrdersProvider.");
  }

  return context;
}
