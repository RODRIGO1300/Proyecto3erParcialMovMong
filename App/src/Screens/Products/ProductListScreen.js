import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import EmptyState from "../../components/EmptyState";
import { API_BASE_URL } from "../../config/api";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { CLUB_THEME } from "../../theme/clubTheme";

const BACKEND_PRODUCTS_URL = `${API_BASE_URL}/products`;
const FAKESTORE_PRODUCTS_URL = "https://fakestoreapi.com/products";

const formatPrice = (value) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "$0.00";
  return `$${numericValue.toFixed(2)} USD`;
};

const fetchProducts = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudieron cargar productos desde ${url}.`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Formato de datos erroneo.");
  }

  return data;
};

const normalizeProduct = (product, source) => ({
  ...product,
  id: product.id ?? product._id,
  source,
  rating: {
    rate: product.rating?.rate ?? 0,
    count: product.rating?.count ?? 0,
  },
});

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { addToCart, cartCount } = useCart();

  const loadProducts = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setErrorMessage("");

      const [backendResult, fakeStoreResult] = await Promise.allSettled([
        fetchProducts(BACKEND_PRODUCTS_URL),
        fetchProducts(FAKESTORE_PRODUCTS_URL),
      ]);

      const backendProducts =
        backendResult.status === "fulfilled"
          ? backendResult.value.map((product) => normalizeProduct(product, "backend"))
          : [];

      const fakeStoreProducts =
        fakeStoreResult.status === "fulfilled"
          ? fakeStoreResult.value.map((product) => normalizeProduct(product, "fakestore"))
          : [];

      const loadedProducts = [...backendProducts, ...fakeStoreProducts];
      if (!loadedProducts.length) {
        throw new Error("No se pudieron cargar productos desde el backend ni desde Fake Store.");
      }

      setProducts(loadedProducts);
    } catch (error) {
      setErrorMessage(error.message || "Error desconocido al obtener productos.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
    await loadProducts(false);
    setRefreshing(false);
  };

  const handlePressProduct = (product) => {
    navigation.navigate("ProductDetails", {
      productId: product.id,
      product,
    });
  };

  const renderProduct = ({ item }) => (
    <View style={styles.cardWrapper}>
      <ProductCard
        name={item.title}
        description={item.description}
        price={formatPrice(item.price)}
        image={item.image}
        category={item.category}
        onPress={() => handlePressProduct(item)}
        onAddToCart={() => {
          addToCart(item);
          Alert.alert("Carrito", "Producto agregado al carrito.");
        }}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.hero}>
      <View style={styles.heroBandTop} />
      <View style={styles.heroBandBottom} />
      <Text style={styles.heroBadge}>Tienda Oficial</Text>
      <Text style={styles.heroTitle}>Coleccion Destacada</Text>
      <Text style={styles.heroSubtitle}>
        Productos seleccionados con estilo premium para tu compra.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loaderText}>Cargando productos...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="Error al cargar productos"
        message={errorMessage}
        actionLabel="Reintentar"
        onAction={() => loadProducts()}
      />
    );
  }

  return (
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            title="Sin productos"
          message="No hay productos disponibles por el momento."
          actionLabel="Recargar"
          onAction={() => loadProducts()}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[CLUB_THEME.brandPrimary.blue, CLUB_THEME.brandPrimary.garnet]}
          tintColor={CLUB_THEME.brandPrimary.blue}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
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
  listContent: {
    padding: 14,
    paddingBottom: 20,
    backgroundColor: CLUB_THEME.neutral.page,
  },
  hero: {
    position: "relative",
    marginBottom: 14,
    padding: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: CLUB_THEME.brandPrimary.blue,
  },
  heroBandTop: {
    position: "absolute",
    top: -14,
    left: -25,
    width: 210,
    height: 80,
    borderRadius: 90,
    backgroundColor: CLUB_THEME.brandPrimary.garnet,
    opacity: 0.8,
  },
  heroBandBottom: {
    position: "absolute",
    right: -35,
    bottom: -28,
    width: 230,
    height: 90,
    borderRadius: 90,
    backgroundColor: CLUB_THEME.brandPrimary.gold,
    opacity: 0.45,
  },
  heroBadge: {
    alignSelf: "flex-start",
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
  },
  heroSubtitle: {
    marginTop: 4,
    color: "#e7eefc",
    fontSize: 13,
    fontWeight: "600",
  },
  cardWrapper: {
    marginBottom: 12,
  },
  cartButton: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
});
