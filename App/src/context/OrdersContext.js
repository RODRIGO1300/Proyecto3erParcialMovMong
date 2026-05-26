import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ORDERS_STORAGE_KEY = "@shop_app_orders";
const OrdersContext = createContext(null);

const normalizeOrder = (order) => ({
  ...order,
  id: String(order.id ?? `ORD-${Date.now()}`),
  userId: String(order.userId ?? ""),
  createdAt: order.createdAt ?? new Date().toISOString(),
  total: Number(order.total ?? 0),
  items: Array.isArray(order.items) ? order.items : [],
});

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const refreshOrders = async (userId) => {
    if (!userId) {
      return orders;
    }

    const nextOrders = orders.filter((order) => order.userId === userId);
    return nextOrders;
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
        if (storedOrders) {
          const parsedOrders = JSON.parse(storedOrders);
          setOrders(Array.isArray(parsedOrders) ? parsedOrders.map(normalizeOrder) : []);
        } else {
          setOrders([]);
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

  const createOrder = async ({ userId, items, total }) => {
    const newOrder = normalizeOrder({
      id: `ORD-${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
      total,
      items,
    });

    setOrders((currentOrders) => [newOrder, ...currentOrders]);
    return newOrder;
  };

  const deleteOrder = (orderId) => {
    setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));
  };

  const getOrdersByUser = (userId) => orders.filter((order) => order.userId === String(userId));

  const value = useMemo(
    () => ({
      orders,
      isReady,
      createOrder,
      deleteOrder,
      getOrdersByUser,
      refreshOrders,
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
