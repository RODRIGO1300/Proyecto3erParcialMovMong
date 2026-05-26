import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { API_BASE_URL } from "../config/api";
import { useAuth } from "./AuthContext";

const ORDERS_URL = `${API_BASE_URL}/orders`;

const OrdersContext = createContext(null);

const normalizeOrder = (order) => ({
  ...order,
  id: order.id ?? order._id,
  userId: order.userId,
  createdAt: order.createdAt ?? order.updatedAt ?? new Date().toISOString(),
  items: (order.items ?? []).map((item) => ({
    ...item,
    id: item.id ?? item.productId,
    productId: item.productId ?? item.id,
    category: item.category ?? "General",
    image: item.image ?? "",
  })),
});

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message;
    throw new Error(message || "La operacion no se pudo completar.");
  }

  return data;
};

export function OrdersProvider({ children }) {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const loadOrders = async (userId = currentUser?.id) => {
    if (!userId) {
      setOrders([]);
      setIsReady(true);
      return [];
    }

    const data = await requestJson(`${ORDERS_URL}?userId=${encodeURIComponent(userId)}`);
    const normalizedOrders = Array.isArray(data) ? data.map(normalizeOrder) : [];
    setOrders(normalizedOrders);
    setIsReady(true);
    return normalizedOrders;
  };

  useEffect(() => {
    loadOrders().catch(() => {
      setOrders([]);
      setIsReady(true);
    });
  }, [currentUser?.id]);

  const createOrder = async ({ userId, items, total }) => {
    const payload = {
      userId,
      status: "procesado",
      paymentMethod: "tarjeta",
      shippingAddress: "Entrega digital / mostrador",
      total,
      items: items.map((item) => ({
        productId: String(item.productId ?? item.id),
        title: item.title,
        category: item.category ?? "General",
        image: item.image ?? "",
        price: Number(item.price ?? 0),
        quantity: Number(item.quantity ?? 1),
      })),
    };

    const savedOrder = normalizeOrder(
      await requestJson(ORDERS_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      })
    );

    setOrders((currentOrders) => [savedOrder, ...currentOrders]);
    return savedOrder;
  };

  const deleteOrder = async (orderId) => {
    await requestJson(`${ORDERS_URL}/${orderId}`, { method: "DELETE" });
    setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));
  };

  const getOrdersByUser = (userId) =>
    orders.filter((order) => String(order.userId) === String(userId));

  const value = useMemo(
    () => ({
      orders,
      isReady,
      createOrder,
      deleteOrder,
      getOrdersByUser,
      refreshOrders: loadOrders,
    }),
    [orders, isReady, currentUser?.id]
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
