import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../Screens/Authentication/LoginScreen";
import RegisterScreen from "../Screens/Authentication/RegistrerScreen";
import { useAuth } from "../context/AuthContext";
import { CLUB_THEME } from "../theme/clubTheme";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function NavigationStack() {
  const { currentUser, isReady } = useAuth();

  if (!isReady) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerTintColor: "#ffffff",
          headerStyle: {
            backgroundColor: CLUB_THEME.brandPrimary.garnet,
          },
        }}
      >
        {currentUser ? (
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "Registro" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
});
