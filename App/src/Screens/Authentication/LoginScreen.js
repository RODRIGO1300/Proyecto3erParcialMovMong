import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { CLUB_THEME } from "../../theme/clubTheme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos incompletos", "Ingresa tu correo y contrasena");
      return;
    }

    const result = await login({ email, password });
    if (!result.ok) {
      Alert.alert("Error", result.message);
      return;
    }

    Alert.alert("Bienvenido", `Hola, ${result.user.name}`);
  };

  return (
    <View style={styles.background}>
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.badge}>Edicion Especial</Text>
          <Text style={styles.title}>Shop App</Text>
          <Text style={styles.subtitle}>Inicia sesion para continuar</Text>

          <Image
            source={require("../../images/Icono.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <TextInput
            placeholder="Correo electronico"
            placeholderTextColor="#6f7fae"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Contrasena"
            placeholderTextColor="#6f7fae"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.secondaryButtonText}>
              No tienes cuenta? Registrate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: CLUB_THEME.brandSecondary.royalBlue,
  },
  decorTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: CLUB_THEME.brandSecondary.red,
    opacity: 0.25,
  },
  decorBottom: {
    position: "absolute",
    bottom: -130,
    left: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: CLUB_THEME.brandSecondary.white,
    opacity: 0.13,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  container: {
    marginHorizontal: 30,
    padding: 22,
    backgroundColor: CLUB_THEME.brandSecondary.white,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: CLUB_THEME.brandSecondary.electricBlue,
  },
  badge: {
    alignSelf: "center",
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: CLUB_THEME.brandSecondary.red,
    color: CLUB_THEME.brandSecondary.white,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 32,
    color: CLUB_THEME.brandSecondary.royalBlue,
    textAlign: "center",
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 14,
    color: "#4c5c85",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: CLUB_THEME.brandSecondary.softBlue,
    color: CLUB_THEME.neutral.textPrimary,
    padding: 14,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#b7c8ee",
  },
  button: {
    backgroundColor: CLUB_THEME.brandSecondary.electricBlue,
    padding: 15,
    borderRadius: 12,
    marginTop: 5,
  },
  buttonText: {
    textAlign: "center",
    color: CLUB_THEME.brandSecondary.white,
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 18,
  },
  secondaryButtonText: {
    textAlign: "center",
    color: CLUB_THEME.brandSecondary.royalBlue,
    fontSize: 14,
    fontWeight: "700",
  },
});
