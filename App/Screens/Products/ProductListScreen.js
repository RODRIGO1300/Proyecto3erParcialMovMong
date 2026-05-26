import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import EmptyState from "../../components/EmptyState";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { CLUB_THEME } from "../../theme/clubTheme";

const PRODUCTS_URL = "https://fakestoreapi.com/products";
const LOCAL_PRODUCTS = [
  {
    id: "local-1",
    title: "Jersey Local Edicion Clasica",
    price: 129,
    description:
      "Jersey inspirado en una temporada historica, con tela ligera y acabado premium para uso casual o deportivo.",
    category: "coleccion local",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.8, count: 24 },
    seller: "Tienda Universitaria",
    isLocal: true,
  },
  {
    id: "local-2",
    title: "Sudadera Azul Premium",
    price: 89,
    description:
      "Sudadera comoda con interior suave, ideal para clima fresco y para combinar con prendas deportivas.",
    category: "coleccion local",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.6, count: 18 },
    seller: "Campus Shop",
    isLocal: true,
  },
  {
    id: "local-3",
    title: "Termo Deportivo Oficial",
    price: 35,
    description:
      "Termo de acero inoxidable con aislamiento termico, perfecto para entrenamientos, clases o trayectos diarios.",
    category: "accesorios",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.7, count: 31 },
    seller: "Club Store",
    isLocal: true,
  },
  {
    id: "local-4",
    title: "Mochila Urbana Oficial",
    price: 75,
    description:
      "Mochila amplia con compartimento acolchado y diseno moderno para uso diario dentro y fuera del campus.",
    category: "accesorios",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.9, count: 12 },
    seller: "Linea Exclusiva",
    isLocal: true,
  },
];

const formatPrice = (value) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "$0.00";
  return `$${numericValue.toFixed(2)} USD`;
};

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

      const response = await fetch(PRODUCTS_URL);
      if (!response.ok) {
        throw new Error("No se pudieron cargar los productos.");
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Formato de datos Erroneo.");
      }

      setProducts([...LOCAL_PRODUCTS, ...data]);
    } catch (error) {
      setErrorMessage(error.message || "Error desconocido al obtener productos.");
      setProducts(LOCAL_PRODUCTS);
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
