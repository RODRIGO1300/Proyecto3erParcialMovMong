import React from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrdersContext";
import { CLUB_THEME } from "../../theme/clubTheme";

const formatPrice = (value) => `$${Number(value || 0).toFixed(2)} USD`;
const formatDate = (value) =>
  new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function OrderScreen({ navigation }) {
  const { currentUser } = useAuth();
  const { getOrdersByUser, deleteOrder } = useOrders();

  const orders = currentUser ? getOrdersByUser(currentUser.id) : [];

  const handleDeleteOrder = (orderId) => {
    Alert.alert("Eliminar pedido", "Deseas borrar este pedido del historial?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteOrder(orderId),
      },
    ]);
  };

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text style={styles.total}>{formatPrice(item.total)}</Text>
      </View>

      <Text style={styles.meta}>{formatDate(item.createdAt)}</Text>
      <Text style={styles.meta}>Productos: {item.items.length}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("OrderDetails", { orderId: item.id })}
        >
          <Text style={styles.secondaryButtonText}>Ver detalle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteOrder(item.id)}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!orders.length) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          title="Sin compras registradas"
          message="Cuando finalices una compra, tu historial aparecera aqui."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CLUB_THEME.neutral.page,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: CLUB_THEME.neutral.page,
  },
  listContent: {
    padding: 14,
  },
  card: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: CLUB_THEME.neutral.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: CLUB_THEME.neutral.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  orderId: {
    flex: 1,
    color: CLUB_THEME.brandSecondary.royalBlue,
    fontSize: 15,
    fontWeight: "800",
  },
  total: {
    color: CLUB_THEME.brandPrimary.garnet,
    fontSize: 16,
    fontWeight: "900",
  },
  meta: {
    marginTop: 6,
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: CLUB_THEME.brandSecondary.softBlue,
  },
  secondaryButtonText: {
    color: CLUB_THEME.brandPrimary.blue,
    fontSize: 13,
    fontWeight: "800",
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#fee2e2",
  },
  deleteButtonText: {
    color: "#b91c1c",
    fontSize: 13,
    fontWeight: "800",
  },
});
