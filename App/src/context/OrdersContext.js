import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { API_BASE_URL } from "../config/api";

const OrdersContext = createContext(null);

const normalizeOrder = (order) => ({
  ...order,
  id: order.id ?? order._id,
  createdAt: order.createdAt ?? order.updatedAt ?? new Date().toISOString(),
  items: (order.items ?? []).map((item) => ({
    ...item,
    id: item.id ?? item.productId,
    productId: item.productId ?? item.id,
  })),
});

const getUserId = (value) => {
  if (!value) return "";
  return typeof value === "object" ? value._id ?? value.id ?? String(value) : String(value);
};

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const fetchOrders = async () => {
    const response = await fetch(`${API_BASE_URL}/orders`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los pedidos del servidor");
    }

    const data = await response.json();
    const normalizedOrders = data.map(normalizeOrder);
    setOrders(normalizedOrders);
    return normalizedOrders;
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        await fetchOrders();
      } catch (error) {
        setOrders([]);
      } finally {
        setIsReady(true);
      }
    };

    loadOrders();
  }, []);

  const createOrder = async ({ userId, items, total }) => {
    const payload = {
      userId,
      status: "completed",
      paymentMethod: "credit card",
      shippingAddress: "Leon, Guanajuato, Mexico",
      total,
      items: items.map((item) => ({
        productId: item.productId ?? item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("No se pudo crear el pedido");
    }

    const newOrder = normalizeOrder(await response.json());
    setOrders((currentOrders) => [newOrder, ...currentOrders]);
    return newOrder;
  };

  const deleteOrder = async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar el pedido");
    }

    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== orderId)
    );
  };

  const getOrdersByUser = (userId) =>
    orders.filter((order) => getUserId(order.userId) === String(userId));

  const value = useMemo(
    () => ({
      orders,
      isReady,
      createOrder,
      deleteOrder,
      getOrdersByUser,
      refreshOrders: fetchOrders,
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
