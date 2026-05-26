import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {ActivityIndicator, Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import EmptyState from "../../components/EmptyState";
import { useCart } from "../../context/CartContext";
import { CLUB_THEME } from "../../theme/clubTheme";

const PRODUCTS_URL = "https://fakestoreapi.com/products";

const formatPrice = (value) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "$0.00";
  return `$${numericValue.toFixed(2)} USD`;
};

export default function ProductDetailsScreen({ navigation, route }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { addToCart, cartCount } = useCart();
  const routeProduct = route?.params?.product;
  const productId = Number(route?.params?.productId ?? route?.params?.id);

  const loadProduct = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) setLoading(true);
        setErrorMessage("");

        if (routeProduct) {
          setProduct(routeProduct);
          return;
        }

        const endpoint = Number.isFinite(productId)
          ? `${PRODUCTS_URL}/${productId}`
          : PRODUCTS_URL;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("No se pudo obtener informacion del producto.");
        }

        const data = await response.json();
        const selectedProduct = Array.isArray(data) ? data[0] : data;
        if (!selectedProduct) {
          throw new Error("No se encontro el producto solicitado.");
        }

        setProduct(selectedProduct);
      } catch (error) {
        setErrorMessage(error.message || "Error inesperado al cargar el producto.");
      } finally {
        setLoading(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.getParent()?.navigate("CartTab")}>
          <Text style={styles.cartButton}>Carrito ({cartCount})</Text>
        </TouchableOpacity>
      ),
    });
  }, [cartCount, navigation]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProduct(false);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loaderText}>Cargando producto...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="No se pudo cargar el producto"
        message={errorMessage}
        actionLabel="Reintentar"
        onAction={() => loadProduct()}
      />
    );
  }

  if (!product) {
    return (
      <EmptyState
        title="Producto no disponible"
        message="No encontramos informacion del producto solicitado."
        actionLabel="Recargar"
        onAction={() => loadProduct()}
      />
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[CLUB_THEME.brandPrimary.blue, CLUB_THEME.brandPrimary.garnet]}
          tintColor={CLUB_THEME.brandPrimary.blue}
        />
      }
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.categoryPill}>
        <Text style={styles.categoryText}>{product.category}</Text>
      </View>

      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>{formatPrice(product.price)}</Text>

      <View style={styles.ratingRow}>
        <Text style={styles.ratingText}>Calificacion: {product.rating?.rate ?? "-"}</Text>
        <Text style={styles.ratingCount}>({product.rating?.count ?? 0} opiniones)</Text>
      </View>

      <Text style={styles.sectionTitle}>Descripcion</Text>
      <Text style={styles.description}>{product.description}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          addToCart(product);
          Alert.alert("Carrito", "Producto agregado al carrito.");
        }}
      >
        <Text style={styles.buttonText}>Agregar al carrito</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CLUB_THEME.neutral.page,
  },
  content: {
    padding: 18,
    paddingBottom: 26,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CLUB_THEME.neutral.page,
  },
  loaderText: {
    marginTop: 10,
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 280,
    marginBottom: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CLUB_THEME.neutral.border,
    backgroundColor: "#ffffff",
  },
  image: {
    width: "88%",
    height: "88%",
  },
  categoryPill: {
    alignSelf: "flex-start",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: CLUB_THEME.brandPrimary.softBlue,
  },
  categoryText: {
    color: CLUB_THEME.brandPrimary.blue,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  title: {
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  price: {
    marginTop: 8,
    color: CLUB_THEME.brandPrimary.garnet,
    fontSize: 22,
    fontWeight: "900",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  ratingText: {
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },
  ratingCount: {
    marginLeft: 8,
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 6,
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  description: {
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: CLUB_THEME.brandPrimary.garnet,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  cartButton: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
});
