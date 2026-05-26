import React from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import EmptyState from "../../components/EmptyState";
import { useOrders } from "../../context/OrdersContext";
import { CLUB_THEME } from "../../theme/clubTheme";

const formatPrice = (value) => `$${Number(value || 0).toFixed(2)} USD`;
const formatDate = (value) =>
  new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function OrderDetailsScreen({ navigation, route }) {
  const { orderId } = route.params;
  const { orders, deleteOrder } = useOrders();

  const order = orders.find((item) => item.id === orderId);

  const handleDeleteOrder = () => {
    Alert.alert("Eliminar pedido", "Deseas borrar este pedido del historial?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          deleteOrder(orderId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!order) {
    return (
      <EmptyState
        title="Pedido no encontrado"
        message="No pudimos encontrar la compra solicitada."
      />
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />

      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productText}>Categoria: {item.category || "General"}</Text>
        <Text style={styles.productText}>Precio: {formatPrice(item.price)}</Text>
        <Text style={styles.productText}>Cantidad: {item.quantity}</Text>
        <Text style={styles.subtotal}>
          Subtotal: {formatPrice(item.price * item.quantity)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={order.items}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <Text style={styles.title}>Pedido {order.id}</Text>
            <Text style={styles.info}>Fecha: {formatDate(order.createdAt)}</Text>
            <Text style={styles.info}>Articulos: {order.items.length}</Text>
            <Text style={styles.total}>Total pagado: {formatPrice(order.total)}</Text>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteOrder}>
              <Text style={styles.deleteButtonText}>Eliminar pedido</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CLUB_THEME.neutral.page,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  headerCard: {
    marginBottom: 16,
    padding: 18,
    backgroundColor: CLUB_THEME.brandPrimary.blue,
    borderRadius: 16,
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
  },
  info: {
    marginTop: 8,
    color: "#dbeafe",
    fontSize: 14,
    fontWeight: "600",
  },
  total: {
    marginTop: 10,
    color: CLUB_THEME.brandPrimary.gold,
    fontSize: 18,
    fontWeight: "900",
  },
  deleteButton: {
    alignSelf: "flex-start",
    marginTop: 16,
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
  productCard: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 14,
    backgroundColor: CLUB_THEME.neutral.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: CLUB_THEME.neutral.border,
  },
  productImage: {
    width: 82,
    height: 82,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productTitle: {
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 15,
    fontWeight: "800",
  },
  productText: {
    marginTop: 4,
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  subtotal: {
    marginTop: 8,
    color: CLUB_THEME.brandPrimary.garnet,
    fontSize: 15,
    fontWeight: "900",
  },
});
