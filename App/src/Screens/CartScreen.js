import React from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CardItem from "../components/CardItem";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { CLUB_THEME } from "../theme/clubTheme";

const formatPrice = (value) => `$${Number(value || 0).toFixed(2)} USD`;

export default function CartScreen({ navigation }) {
  const {
    items,
    cartTotal,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
  } = useCart();
  const { currentUser } = useAuth();
  const { createOrder } = useOrders();

  const handleCheckout = () => {
    if (!currentUser) {
      Alert.alert("Sesion requerida", "Inicia sesion para completar tu compra.");
      return;
    }

    const orderItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    createOrder({
      userId: currentUser.id,
      items: orderItems,
      total: cartTotal,
    });

    Alert.alert("Compra realizada", "Tu pedido fue procesado correctamente.", [
      {
        text: "Aceptar",
        onPress: () => {
          clearCart();
          navigation.navigate("OrdersTab");
        },
      },
    ]);
  };

  if (!items.length) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          title="Tu carrito esta vacio"
          message="Agrega productos desde la lista o desde el detalle para verlos aqui."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CardItem
            title={item.title}
            subtitle={item.category}
            image={item.image}
            price={formatPrice(item.price * item.quantity)}
            quantity={item.quantity}
            onRemove={() => removeFromCart(item.id)}
            onIncrement={() => incrementQuantity(item.id)}
            onDecrement={() => decrementQuantity(item.id)}
          />
        )}
        ListFooterComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen de compra</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Productos</Text>
              <Text style={styles.summaryValue}>{items.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.totalText}>{formatPrice(cartTotal)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Finalizar compra</Text>
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
  emptyContainer: {
    flex: 1,
    backgroundColor: CLUB_THEME.neutral.page,
  },
  listContent: {
    padding: 14,
    paddingBottom: 24,
  },
  summaryCard: {
    marginTop: 8,
    padding: 16,
    backgroundColor: CLUB_THEME.neutral.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#ccd7ec",
  },
  summaryTitle: {
    marginBottom: 14,
    color: CLUB_THEME.brandSecondary.royalBlue,
    fontSize: 15,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
  summaryValue: {
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  totalText: {
    color: CLUB_THEME.brandPrimary.garnet,
    fontSize: 20,
    fontWeight: "900",
  },
  checkoutButton: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: CLUB_THEME.brandSecondary.electricBlue,
  },
  checkoutText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
