import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import CartScreen from "../Screens/CartScreen";
import OrderDetailsScreen from "../Screens/Orders/OrderDetailsScreen";
import OrderScreen from "../Screens/Orders/OrderScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import ProductDetailsScreen from "../Screens/Products/ProductDetailsScreen";
import ProductListScreen from "../Screens/Products/ProductListScreen";
import { useCart } from "../context/CartContext";
import { CLUB_THEME } from "../theme/clubTheme";

const Tab = createBottomTabNavigator();
const ProductStack = createNativeStackNavigator();
const OrdersStack = createNativeStackNavigator();

function ProductsNavigator() {
  return (
    <ProductStack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#ffffff",
        headerStyle: {
          backgroundColor: CLUB_THEME.brandPrimary.blue,
        },
      }}
    >
      <ProductStack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: "Productos" }}
      />
      <ProductStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: "Detalle del producto" }}
      />
    </ProductStack.Navigator>
  );
}

function OrdersNavigator() {
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#ffffff",
        headerStyle: {
          backgroundColor: CLUB_THEME.brandPrimary.blue,
        },
      }}
    >
      <OrdersStack.Screen
        name="OrdersList"
        component={OrderScreen}
        options={{ title: "Historial" }}
      />
      <OrdersStack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: "Detalle del pedido" }}
      />
    </OrdersStack.Navigator>
  );
}

export default function MainTabs() {
  const { cartCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        tabBarActiveTintColor: CLUB_THEME.brandPrimary.garnet,
        tabBarInactiveTintColor: "#4f5f8f",
        tabBarLabelStyle: {
          fontWeight: "700",
        },
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 2,
          borderTopColor: "#b2c5ea",
          backgroundColor: "#eef3ff",
        },
      }}
    >
      <Tab.Screen
        name="ProductsTab"
        component={ProductsNavigator}
        options={{
          title: "Productos",
          headerShown: false,
          tabBarLabel: "Productos",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "storefront" : "storefront-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: "Carrito",
          tabBarLabel: "Carrito",
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersNavigator}
        options={{
          title: "Pedidos",
          headerShown: false,
          tabBarLabel: "Pedidos",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
